import { useState } from "react";
import { useHotelStore } from "@/store/hotelStore";
import {
  Filter,
  MapPin,
  Check,
  X,
  Coffee,
  Wifi,
  Car,
  // ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NoHotelsFound from "@/components/NoHotelsFound";
import { useNavigate } from "react-router";
import { formatPrice } from "@/lib/utils";

const HotelSearchResult = () => {
  const hotels = useHotelStore((state) => state.hotels);
  const loading = useHotelStore((state) => state.loading);
  const error = useHotelStore((state) => state.error);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [bedType, setBedType] = useState<string[]>([]);
  const [refundable, setRefundable] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState(false);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <X className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-700">Search Error</h3>
          </div>
          <p className="text-red-600">{error}</p>
          <Button
            className="mt-4 bg-red-600 hover:bg-red-700"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">
              No Hotels Found
            </h2>
          </div>
          <p className="text-blue-600 mb-6">
            Try adjusting your search criteria or exploring different dates.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.history.back()}
          >
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const filteredHotels = hotels.filter((hotel) => {
    const matchesBedType =
      bedType.length > 0 ? bedType.includes(hotel.bedType) : true;
    const matchesRefundable =
      refundable === true ? hotel.refundable === true : true;
    const macthesPrices =
      parseInt(hotel.price) >= priceRange[0] &&
      parseInt(hotel.price) <= priceRange[1];
    return matchesBedType && matchesRefundable && macthesPrices;
  });

  const bedTypes = new Set(hotels.map((hotel) => hotel.bedType));

  const onClearFilters = () => {
    setBedType([]);
    setRefundable(false);
    setPriceRange([0, 3000]);
  };

  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-12 ">
      {/* Header with search summary */}
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">Hotel Search Results</h1>
          <p className="text-blue-100">
            Found {hotels.length} hotels in{" "}
            {hotels[0]?.cityCode || "your destination"}
          </p>
        </div>
      </div>

      {/* Filters and Sort section */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="hidden md:flex space-x-2">
              <Badge variant="secondary" className="px-3 py-1">
                Check-in: {hotels[0]?.checkIn}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Check-out: {hotels[0]?.checkOut}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Guests: {hotels[0]?.guests}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filter panel - conditionally shown */}
        {filterOpen && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    €{priceRange[0]}
                  </span>
                  <span className="text-sm text-gray-600">
                    €{priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  className="w-full"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Bed Type</h3>
                <div className="space-y-2">
                  {Array.from(bedTypes).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        defaultChecked={false}
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            setBedType([...bedType, type]);
                          } else {
                            setBedType(bedType.filter((item) => item !== type));
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}{" "}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Amenities</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked={false}
                      onChange={(e) => {
                        setRefundable(e.currentTarget.checked);
                      }}
                    />
                    <span>Refundable</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => {
              return (
                <div
                  key={hotel.hotelName}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                    {/* Hotel Image */}
                    <div className="md:col-span-1 h-48 md:h-full bg-blue-100 relative">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(/api/placeholder/400/300)`,
                        }}
                      ></div>

                      {hotel.refundable && (
                        <div className="absolute top-0 left-0 bg-green-600 text-white text-xs px-2 py-1 m-2 rounded">
                          Fully Refundable
                        </div>
                      )}
                    </div>

                    {/* Hotel Details */}
                    <div className="p-4 md:p-6 md:col-span-2 lg:col-span-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold mb-1">
                            {hotel.hotelName}
                          </h2>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.cityCode}
                      </div>

                      <div className="mb-3">
                        <div className="text-sm flex flex-wrap gap-2">
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
                            <Wifi className="w-3 h-3 mr-1" /> Free WiFi
                          </span>
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
                            <Coffee className="w-3 h-3 mr-1" /> Breakfast
                          </span>
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-2 py-1 text-xs">
                            <Car className="w-3 h-3 mr-1" /> Parking
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 line-clamp-2">
                        {hotel.description ||
                          "Experience comfort and luxury at this centrally located property. Enjoy modern amenities and exceptional service throughout your stay."}
                      </div>

                      <div className="mt-3 text-sm">
                        <span className="font-medium">
                          {hotel.roomCategory || "Standard Room"}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          • {hotel.bedInfo}
                        </span>
                      </div>
                    </div>

                    {/* Price and Booking */}
                    <div className="p-4 md:p-6 bg-gray-50 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          3-night stay
                        </div>
                        <div className="font-bold text-2xl mb-1">
                          {(() => {
                            const priceInEur = formatPrice({
                              price: hotel.price,
                              rateToEur: hotel.rateToEur,
                            });
                            return priceInEur === "€0.00"
                              ? "Rate Conversion Issue"
                              : priceInEur;
                          })()}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Includes taxes & fees
                        </div>

                        {hotel.refundable ? (
                          <div className="flex items-center text-green-600 text-sm mb-4">
                            <Check className="w-4 h-4 mr-1" />
                            <span>Free cancellation</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500 text-sm mb-4">
                            <X className="w-4 h-4 mr-1" />
                            <span>Non-refundable</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => navigate("/payments")}
                        >
                          Select Hotel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <NoHotelsFound onClearFilters={() => onClearFilters()} />
          )}
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-12 ">
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 bg-blue-500 mb-2" />
          <Skeleton className="h-5 w-48 bg-blue-500" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24" />
            <div className="hidden md:flex space-x-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-36" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
              <div className="md:col-span-1 h-48 md:h-full">
                <Skeleton className="w-full h-full" />
              </div>

              <div className="p-4 md:p-6 md:col-span-2 lg:col-span-2">
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="flex gap-2 mb-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="p-4 md:p-6 bg-gray-50 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-3 w-40 mb-4" />
                  <Skeleton className="h-4 w-32 mb-4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelSearchResult;
