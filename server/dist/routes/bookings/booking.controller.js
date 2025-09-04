"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarDetails = exports.getHotelDetails = exports.getFlightDetails = void 0;
const flight_validator_1 = require("./flights/flight.validator");
const errorParser_1 = require("../../utils/errorParser");
const amadeus_1 = require("../../utils/amadeus");
const luxon_1 = require("luxon");
const flights_model_1 = require("./flights/flights.model");
const hotel_validator_1 = require("./hotels/hotel.validator");
const hotel_model_1 = require("./hotels/hotel.model");
const car_validator_1 = require("./car/car.validator");
const car_model_1 = require("./car/car.model");
const general_utils_1 = require("../../utils/general.utils");
const getFlightDetails = async (req, res, next) => {
    try {
        const parsed = flight_validator_1.flightValidator.safeParse(req.body);
        if (!parsed.success) {
            return (0, errorParser_1.errorParser)(parsed, res);
        }
        const { fromLocation, toLocation, departureDate, returnDate, traverlerDetails: { adults, children }, userTimezone, } = parsed.data;
        if (returnDate &&
            luxon_1.DateTime.fromISO(departureDate) > luxon_1.DateTime.fromISO(returnDate)) {
            return res.status(400).json({
                success: false,
                message: "Return date must be after departure date",
            });
        }
        const params = {
            originLocationCode: fromLocation,
            destinationLocationCode: toLocation,
            departureDate,
            adults,
            max: 5,
            currencyCode: "EUR",
        };
        if (returnDate)
            params.returnDate = returnDate;
        let response;
        try {
            response = await amadeus_1.amadeus.shopping.flightOffersSearch.get(params);
        }
        catch (err) {
            return res.status(502).json({
                success: false,
                message: "Failed to fetch flight data from the flight provider.",
            });
        }
        const mappedFlights = await Promise.all(response.data.map(async (offer) => {
            const itinerary = offer.itineraries?.[0] ?? null;
            const segments = itinerary?.segments ?? [];
            const firstSegment = segments[0] ?? null;
            const lastSegment = segments[segments.length - 1] ?? null;
            const traveler = offer.travelerPricings?.[0] ?? null;
            const fareSegment = traveler?.fareDetailsBySegment?.[0] ?? null;
            const formattedArrivalTime = lastSegment?.arrival?.at
                ? luxon_1.DateTime.fromISO(lastSegment.arrival.at, {
                    zone: userTimezone,
                }).toFormat("cccc, dd LLL yyyy, hh:mm a")
                : null;
            const formattedDepartureTime = firstSegment?.departure?.at
                ? luxon_1.DateTime.fromISO(firstSegment.departure.at, {
                    zone: userTimezone,
                }).toFormat("cccc, dd LLL yyyy, hh:mm a")
                : null;
            const duration = itinerary?.duration
                ? luxon_1.Duration.fromISO(itinerary.duration)
                : null;
            const readableDuration = duration
                ? `${duration.hours ?? 0}h ${duration.minutes ?? 0}m`
                : null;
            const from = traveler?.price?.currency ?? offer.price?.currency;
            const rateToEur = await (0, general_utils_1.getConversionRateToEUR)(from);
            return {
                airlineName: firstSegment?.operating?.carrierName ?? null,
                airlineCode: firstSegment?.carrierCode ?? null,
                flightNumber: firstSegment?.number ?? null,
                from: firstSegment?.departure?.iataCode ?? null,
                to: lastSegment?.arrival?.iataCode ?? null,
                departureTime: formattedDepartureTime,
                arrivalTime: formattedArrivalTime,
                totalDuration: readableDuration,
                numberOfStops: segments.length > 0 ? segments.length - 1 : null,
                cabinClass: fareSegment?.cabin ?? null,
                checkedBags: fareSegment?.includedCheckedBags?.quantity ?? null,
                cabinBags: fareSegment?.includedCabinBags?.quantity ?? null,
                totalPrice: traveler?.price?.total ?? offer.price?.total ?? null,
                currency: traveler?.price?.currency ?? offer.price?.currency ?? null,
                isUpsellOffer: offer.isUpsellOffer ?? false,
                rateToEur,
                lastTicketingDate: offer.lastTicketingDate ?? null,
            };
        }));
        res.status(200).json({
            success: true,
            data: mappedFlights,
        });
        res.on("finish", async () => {
            try {
                await flights_model_1.FlightModel.create({
                    From: fromLocation,
                    To: toLocation,
                    DepartureDate: departureDate,
                    ReturnDate: returnDate,
                    TravelerDetails: { adults, children },
                    user: req.body.user?.id || null,
                });
            }
            catch (logErr) {
                console.error("Background flight log failed:", logErr);
            }
        });
    }
    catch (error) {
        console.error("Flight fetch error:", error);
        return res.status(500).json({
            success: false,
            message: "Unexpected server error while fetching flight details.",
        });
    }
};
exports.getFlightDetails = getFlightDetails;
const getHotelDetails = async (req, res, next) => {
    try {
        const parsed = hotel_validator_1.hotelValidator.safeParse(req.body);
        if (!parsed.success) {
            return (0, errorParser_1.errorParser)(parsed, res);
        }
        const { checkIn, checkout, destination, guestDetails, roomType } = parsed.data;
        if (luxon_1.DateTime.fromISO(checkIn) > luxon_1.DateTime.fromISO(checkout)) {
            return res.status(400).json({
                success: false,
                message: "Check-in date must be before check-out date.",
            });
        }
        let hotelsResponse;
        try {
            hotelsResponse = await amadeus_1.amadeus.referenceData.locations.hotels.byCity.get({
                cityCode: destination,
            });
        }
        catch (err) {
            return res.status(502).json({
                success: false,
                message: "Failed to fetch hotel locations from external provider.",
            });
        }
        const hotels = hotelsResponse?.data;
        if (!hotels || hotels.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No hotels found for the provided destination.",
            });
        }
        const hotelIds = hotels
            .slice(0, 25)
            .map((hotel) => hotel.hotelId)
            .join(",");
        let offersResponse;
        try {
            offersResponse = await amadeus_1.amadeus.shopping.hotelOffersSearch.get({
                hotelIds,
                checkInDate: checkIn,
                checkOutDate: checkout,
                adults: guestDetails.adults,
                children: guestDetails.children?.length || 0,
                roomQuantity: guestDetails.rooms,
                currency: "EUR",
            });
        }
        catch (err) {
            return res.status(502).json({
                success: false,
                message: "Failed to fetch hotel offers. Please try again later.",
            });
        }
        if (!offersResponse.data || offersResponse.data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No hotel offers available for the selected dates.",
            });
        }
        const mappedHotels = await Promise.all(offersResponse.data.map(async (offer) => {
            const hotelName = offer.hotel.name;
            const cityCode = offer.hotel.cityCode;
            const room = offer.offers[0].room;
            const roomCategory = room.typeEstimated.category || "Not specified";
            const bedInfo = `${room.typeEstimated.beds || "N/A"} ${room.typeEstimated.bedType || "Bed"}(s)`;
            const description = room.description?.text || "No description provided";
            const checkInDate = offer.offers[0].checkInDate;
            const checkOutDate = offer.offers[0].checkOutDate;
            const price = offer.offers[0].price.total;
            const currency = offer.offers[0].price.currency;
            const refundable = offer.offers[0].policies?.refundable?.cancellationRefund ===
                "REFUNDABLE_UP_TO_DEADLINE";
            const bedType = room.typeEstimated.bedType || "N/A";
            const guests = offer.offers[0].guests?.adults || 1;
            const from = currency;
            const rateToEur = await (0, general_utils_1.getConversionRateToEUR)(from);
            return {
                hotelName,
                cityCode,
                roomCategory,
                bedInfo,
                description,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                price,
                currency,
                refundable,
                guests,
                bedType,
                rateToEur,
            };
        }));
        try {
            await hotel_model_1.HotelModel.insertOne({
                user: req.body.user?.id,
                Destination: destination,
                CheckIn: checkIn,
                CheckOut: checkout,
                GuestDetails: guestDetails,
                RoomType: roomType || "",
            });
        }
        catch (err) {
            console.error("Database insert error:", err);
        }
        return res.status(200).json({
            success: true,
            data: mappedHotels,
        });
    }
    catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while processing hotel details.",
        });
    }
};
exports.getHotelDetails = getHotelDetails;
const getCarDetails = async (req, res, next) => {
    try {
        const parsed = car_validator_1.carBookingValidator.safeParse(req.body);
        if (!parsed.success) {
            return (0, errorParser_1.errorParser)(parsed, res);
        }
        const { pickUpLocation, pickUpDate, pickUpTime, dropOffLocation, dropOffDate, dropOffTime, } = parsed.data;
        const pickupDateTime = new Date(`${pickUpDate}T${pickUpTime}:00`);
        const dropoffDateTime = new Date(`${dropOffDate}T${dropOffTime}:00`);
        if (isNaN(pickupDateTime.getTime()) || isNaN(dropoffDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid pick-up or drop-off date/time format.",
            });
        }
        if (pickupDateTime.getTime() >= dropoffDateTime.getTime()) {
            return res.status(400).json({
                success: false,
                message: "Pick-up date/time must be earlier than drop-off date/time.",
            });
        }
        const durationInMs = dropoffDateTime - pickupDateTime;
        const durationInMinutes = durationInMs / (1000 * 60);
        if (durationInMinutes < 60) {
            return res.status(400).json({
                success: false,
                message: "Minimum rental duration is 1 hour.",
            });
        }
        const maxRentalDays = 30;
        if (durationInMinutes > maxRentalDays * 24 * 60) {
            return res.status(400).json({
                success: false,
                message: `Maximum rental duration is ${maxRentalDays} days.`,
            });
        }
        let availabilityResponse;
        try {
            const formattedPickup = pickupDateTime.toISOString().slice(0, 19);
            const formattedDropoff = dropoffDateTime.toISOString().slice(0, 19);
            const transferSearchBody = {
                startLocationCode: pickUpLocation,
                endLocationCode: dropOffLocation,
                startDateTime: formattedPickup,
                endDateTime: formattedDropoff,
                transferType: "PRIVATE",
                currencyCode: "EUR",
            };
            availabilityResponse = await amadeus_1.amadeus.shopping.transferOffers.post(transferSearchBody);
        }
        catch (err) {
            const statusCode = err?.response?.statusCode || 502;
            const errorCode = err?.code || null;
            const errorMessage = err?.description || err?.message || "Unknown error occurred";
            console.error("Amadeus API Error:", {
                code: errorCode,
                status: statusCode,
                message: errorMessage,
            });
            let clientMessage = "Unable to fetch transfer offers. Please try again later.";
            if (statusCode === 400) {
                clientMessage =
                    "Bad request sent to transfer provider. Please check your pickup/dropoff info.";
            }
            else if (statusCode === 401 || statusCode === 403) {
                clientMessage =
                    "Authentication with transfer provider failed. Please contact support.";
            }
            else if (statusCode === 429) {
                clientMessage =
                    "Rate limit exceeded with transfer provider. Please try again after a short while.";
            }
            else if (statusCode >= 500 && statusCode < 600) {
                clientMessage =
                    "Transfer provider is currently unavailable. Please try again shortly.";
            }
            return res.status(statusCode).json({
                success: false,
                message: clientMessage,
                error: {
                    code: errorCode,
                    detail: errorMessage,
                },
            });
        }
        const availableCars = availabilityResponse?.data;
        if (!Array.isArray(availableCars) || availableCars.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No available cars found for the selected route and time.",
            });
        }
        const carsDetails = await Promise.all(availableCars.map(async (car) => {
            const vehicle = car.vehicle || {};
            const provider = car.serviceProvider || {};
            const quotation = car.converted || car.quotation || {};
            const seats = vehicle.seats?.[0]?.count ?? 0;
            const from = quotation.currencyCode;
            const rateToEur = await (0, general_utils_1.getConversionRateToEUR)(from);
            return {
                id: car.id,
                providerName: provider.name || "Unknown Provider",
                providerLogo: provider.logoUrl || "",
                vehicleImage: vehicle.imageURL || "",
                vehicleDescription: vehicle.description || "Vehicle description not available",
                seatCount: seats,
                startTime: car.start?.dateTime || "",
                startLocation: car.start?.locationCode || "Unknown",
                endTime: car.end?.dateTime || "",
                endLocation: car.end?.locationCode || "Unknown",
                price: quotation.monetaryAmount || "0",
                rateToEur,
                currency: quotation.currencyCode || "EUR",
                distanceKm: car.distance?.value || 0,
            };
        }));
        try {
            await car_model_1.CarBookingModel.insertOne({
                user: req.body.user?.id,
                pickUpLocation,
                pickUpDate,
                pickUpTime,
                dropOffLocation,
                dropOffDate,
                dropOffTime,
                returnToSameLocation: pickUpLocation === dropOffLocation,
            });
        }
        catch (err) {
            console.error("Database insert error:", err?.message || err);
        }
        return res.status(200).json({
            success: true,
            data: carsDetails,
        });
    }
    catch (error) {
        console.error("Unexpected server error:", error?.message || error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing the car booking request.",
            error: error?.message || "Unknown internal error",
        });
    }
};
exports.getCarDetails = getCarDetails;
//# sourceMappingURL=booking.controller.js.map