import { motion, AnimatePresence } from "framer-motion";
import { useFlightStore } from "@/store/flightStore";
import FlightCard from "./FlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, SearchX, PlaneTakeoff, Search } from "lucide-react"; // Using PlaneTakeoff for initial state
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";
const FlightCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="border bg-white border-slate-200 rounded-lg overflow-hidden mb-4 shadow-sm"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start p-5 gap-4">
      <div className="flex-1 space-y-4 w-full">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6   bg-slate-400/20   w-24 rounded" />{" "}
          <Skeleton className="h-4   bg-slate-400/20   w-16 rounded" />{" "}
        </div>
        <div className="flex items-center gap-4">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5   bg-slate-400/20   w-16 rounded" />{" "}
            <Skeleton className="h-3   bg-slate-400/20   w-10 rounded" />
          </div>
          <div className="flex flex-col items-center opacity-40 mx-2">
            <Skeleton className="h-4   bg-slate-400/20   w-4 rounded-full " />
            <Skeleton className="h-3   bg-slate-400/20   w-14 rounded mt-1" />
          </div>
          <div className="space-y-1.5 flex-1 text-right sm:text-left">
            <Skeleton className="h-5   bg-slate-400/20   w-16 rounded ml-auto sm:ml-0" />{" "}
            <Skeleton className="h-3   bg-slate-400/20   w-10 rounded ml-auto sm:ml-0" />
          </div>
        </div>
        <Skeleton className="h-4   bg-slate-400/20   w-32 rounded" />
      </div>
      <div className="sm:border-l border-slate-200 sm:pl-4 flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto sm:min-w-[140px] mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0">
        <Skeleton className="h-8   bg-slate-400/20   w-24 rounded ml-auto" />{" "}
        {/* Price */}
        <Skeleton className="h-4   bg-slate-400/20   w-20 rounded ml-auto" />{" "}
        {/* Price Subtext */}
        <Skeleton className="h-10  bg-slate-400/20    w-full rounded-md mt-2" />{" "}
        {/* Button */}
      </div>
    </div>
  </motion.div>
);

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const FlightResultsDisplay = () => {
  const flights = useFlightStore((state) => state.flights);
  const loading = useFlightStore((state) => state.loading);
  const error = useFlightStore((state) => state.error);
  const allFetchedFlights = useFlightStore((state) => state.allFetchedFlights);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-lg h-96"
      >
        <AlertTriangle className="w-16 h-16 text-red-500 mb-5" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          Flight Search Error
        </h3>
        <p className="text-slate-500 max-w-md">{error}</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <FlightCardSkeleton key={`skel-${index}`} />
        ))}
      </div>
    );
  }

  if (!loading && allFetchedFlights.length > 0 && flights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-lg h-96"
      >
        <SearchX className="w-16 h-16 text-sky-500 mb-5" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          No Flights Match Filters
        </h3>
        <p className="text-slate-500">
          Try adjusting or resetting your filters.
        </p>
      </motion.div>
    );
  }

  if (!loading && allFetchedFlights.length === 0 && !error) {
    return (
      <div className="relative overflow-hidden">
        <Card className="relative flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-xl border-0 min-h-[28rem]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-30 transform translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full opacity-40 transform -translate-x-6 translate-y-6"></div>

          {/* Main content */}
          <div className="relative z-10">
            {/* Icon with animated background */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-10 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg">
                <PlaneTakeoff className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-3">
              No Flights Available Right Now
            </h3>

            {/* Subheading */}
            <p className="text-lg text-slate-600 mb-2 font-medium">
              Don't worry! Let's find your perfect flight
            </p>

            {/* Description */}
            <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
              Flights for your selected route might be fully booked or not
              available for your dates. Try adjusting your search criteria or
              explore alternative options.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to={"/flights"}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className={cn(
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
                      "text-white border-0 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl",
                      "transition-all duration-300 font-medium"
                    )}
                    size="lg"
                  >
                    <FontAwesomeIcon icon={faPlane} className="mr-2" />
                    Search New Flights
                  </Button>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link to={"/flights"}>
                  <Button
                    variant="outline"
                    className={cn(
                      "border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50",
                      "text-slate-700 hover:text-blue-600 rounded-xl px-6 py-3",
                      "transition-all duration-300 font-medium bg-white shadow-sm hover:shadow-md"
                    )}
                    size="lg"
                    onClick={() => {}}
                  >
                    <Search className="mr-2 w-4 h-4" />
                    Modify Search
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Helpful suggestions */}
            <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
              <p className="text-sm font-medium text-slate-600 mb-2">
                💡 Try these suggestions:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Change dates
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  Nearby airports
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Flexible times
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {flights?.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlightResultsDisplay;
