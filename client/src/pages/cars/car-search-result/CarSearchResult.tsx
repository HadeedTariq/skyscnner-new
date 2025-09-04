import { useCarStore, CarData } from "@/store/carStore";

import { Filter } from "lucide-react";

import {
  AlertCircle,
  Users,
  Zap,
  Clock, // Used for distanceKm
  Snowflake, // For AC
  Settings2, // For Transmission
  MapPin, // For Pickup Location
  ShieldCheck,
  Heart,
  ChevronDown,
  Briefcase, // Placeholder for luggage if you add it
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import NoCarsFound from "@/components/NoCarsFound";
import { formatPrice } from "@/lib/utils";

// Animation Variants
const cardListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const CarSearchResult = () => {
  const cars = useCarStore((state) => state.cars);

  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 18000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const loading = useCarStore((state) => state.loading);
  const error = useCarStore((state) => state.error);

  const getCarCardFeatures = (car: CarData) => {
    const features = [];
    if (car.seatCount) {
      features.push({
        icon: <Users className="w-3.5 h-3.5 text-gray-500" />,
        label: `${car.seatCount} Seats`,
      });
    }
    // To match the visual style of 4 features in a 2x2 grid from image:
    // Placeholder for AC (if you don't have this data, otherwise use car.hasAC or similar)
    features.push({
      icon: <Snowflake className="w-3.5 h-3.5 text-gray-500" />,
      label: "AC",
    });

    // Placeholder for Transmission (if you don't have this data)
    features.push({
      icon: <Settings2 className="w-3.5 h-3.5 text-gray-500" />,
      label: "Manual",
    }); // Or 'Automatic'

    if (car.distanceKm) {
      // Adding distance as it's in your data
      features.push({
        icon: <Clock className="w-3.5 h-3.5 text-gray-500" />,
        label: `${car.distanceKm} km included`,
      });
    } else {
      // Placeholder for luggage to fill space if distanceKm is missing
      features.push({
        icon: <Briefcase className="w-3.5 h-3.5 text-gray-500" />,
        label: "2 Bags",
      });
    }

    return features.slice(0, 4); // Ensure only 4 features are shown for the grid
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-280px)] text-center p-4">
        <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mb-5" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
          Error Loading Results
        </h2>
        <p className="text-gray-500 mb-5 text-sm sm:text-base max-w-md">
          {error}
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (loading) {
    // Updated Skeleton to match the 3-column layout
    return (
      <div className="space-y-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-3 sm:p-4 flex flex-col md:flex-row gap-3 sm:gap-4 animate-pulse"
          >
            <Skeleton className="h-36 sm:h-40 w-full md:w-1/3 lg:w-[220px] rounded-lg flex-shrink-0" />{" "}
            {/* Image part */}
            <div className="w-full md:w-1/2 lg:flex-grow space-y-2.5 py-1 sm:py-2 md:border-l md:border-r md:border-gray-200 md:px-3 lg:px-4">
              {" "}
              {/* Details part */}
              <Skeleton className="h-5 w-3/4" /> {/* Title */}
              <Skeleton className="h-3.5 w-1/2" /> {/* Subtitle */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1.5">
                <Skeleton className="h-4 w-20" />{" "}
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-18" />{" "}
                <Skeleton className="h-4 w-22" />
              </div>
              <Skeleton className="h-4 w-full mt-1" /> {/* Pickup Location */}
            </div>
            <div className="w-full md:w-1/3 lg:w-[200px] space-y-2.5 flex flex-col items-center md:items-end justify-between py-1 sm:py-2 md:pl-3 lg:pl-4 flex-shrink-0">
              {" "}
              {/* Price part */}
              <div className="flex flex-col items-center md:items-end w-full">
                <div className="flex items-center justify-center md:justify-end w-full mb-1">
                  <Skeleton className="h-4 w-12 mr-2" /> {/* Supplier Tag */}
                  <Skeleton className="h-4 w-16" /> {/* Deals from text */}
                  <Skeleton className="h-5 w-5 ml-auto" /> {/* Heart Icon */}
                </div>
                <Skeleton className="h-7 w-24" /> {/* Price */}
                <Skeleton className="h-3.5 w-20 mt-1" />{" "}
                {/* Free Cancellation */}
              </div>
              <Skeleton className="h-9 w-full md:w-32 mt-2.5" />{" "}
              {/* View Deals Button */}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-280px)] text-center p-4">
        <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-5" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
          No Cars Found
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Try adjusting your search criteria or check back later.
        </p>
      </div>
    );
  }

  const filteredCars = cars.filter((car) => {
    const macthesPrices =
      parseInt(car.price) >= priceRange[0] &&
      parseInt(car.price) <= priceRange[1];
    return macthesPrices;
  });
  const onClearFilters = () => {
    setPriceRange([1000, 18000]);
  };

  return (
    <motion.div
      className="space-y-5"
      variants={cardListVariants}
      initial="hidden"
      animate="visible"
    >
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
        </div>
      </div>
      {filterOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">€{priceRange[0]}</span>
                <span className="text-sm text-gray-600">€{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={18000}
                className="w-full"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
              />
            </div>
          </div>
        </div>
      )}
      {filteredCars.length > 0 ? (
        filteredCars.map((car) => (
          <motion.div
            key={car.id}
            variants={cardItemVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <div className="w-full md:w-1/3 lg:w-[220px] p-3 sm:p-4 flex-shrink-0 flex items-center justify-center bg-gray-50 md:bg-transparent">
              <img
                src={
                  car.vehicleImage ||
                  "https://via.placeholder.com/250x180?text=No+Image"
                }
                alt={car.vehicleDescription}
                className="max-h-32 sm:max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105" // Added group-hover for potential parent hover effect
              />
            </div>

            {/* Middle: Car Details */}
            <div className="w-full md:w-1/2 lg:flex-grow p-3 sm:p-4 flex flex-col justify-between md:border-l md:border-r md:border-gray-200">
              <div>
                <h3 className="text-md sm:text-lg font-bold text-gray-800 mb-0.5 leading-tight">
                  {car.vehicleDescription}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2.5">
                  or similar vehicle
                </p>

                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-xs sm:text-sm mb-2.5">
                  {getCarCardFeatures(car).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {feature.icon}
                      <span className="text-gray-600">{feature.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span>Pick-up: {car.startLocation || "Not specified"}</span>
                </div>
              </div>
              {/* Pickup/Dropoff Times - originally from your code, removed for UI simplicity, can add back if needed
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                <p>Pickup: {car.startTime}</p>
                <p>Dropoff: {car.endTime} at {car.endLocation}</p>
             </div>
            */}
            </div>

            <div className="w-full md:w-1/3 lg:w-[200px] p-3 sm:p-4 flex flex-col justify-between items-center md:items-end text-center md:text-right flex-shrink-0">
              <div className="w-full">
                <div className="flex items-center justify-center md:justify-end mb-1 w-full">
                  <span
                    className={`text-[0.7rem] px-1.5 py-0.5 rounded-sm font-medium mr-1.5 leading-tight ${
                      car.providerName?.toLowerCase() === "europcar"
                        ? "bg-green-500 text-white"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {car.providerName || "Supplier"}
                  </span>
                  <span className="text-[0.7rem] sm:text-xs text-gray-500 whitespace-nowrap">
                    1 deal from
                  </span>{" "}
                  {/* Assuming 1 deal, adjust if you have this data */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-gray-400 hover:text-red-500 h-6 w-6 sm:h-7 sm:w-7"
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-none">
                  {(() => {
                    const priceInEur = formatPrice({
                      price: car.price,
                      rateToEur: car.rateToEur,
                    });
                    return priceInEur === "€0.00"
                      ? "Rate Conversion Issue"
                      : priceInEur;
                  })()}

                  <span className="text-[0.7rem] sm:text-xs font-normal text-gray-500 ml-1">
                    {" "}
                    total
                  </span>
                </p>

                <div className="flex items-center justify-center md:justify-end gap-1 text-[0.7rem] sm:text-xs text-green-600 mt-0.5">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Free cancellation</span>
                </div>
              </div>

              <Button className="w-full md:w-auto mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center">
                View deals <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </motion.div>
        ))
      ) : (
        <NoCarsFound onClearFilters={() => onClearFilters()} />
      )}
    </motion.div>
  );
};

export default CarSearchResult;
