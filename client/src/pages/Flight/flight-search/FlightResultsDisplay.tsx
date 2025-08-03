import { motion, AnimatePresence } from "framer-motion";
import { useFlightStore } from "@/store/flightStore";
import FlightCard from "./FlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, SearchX, PlaneTakeoff } from "lucide-react"; // Using PlaneTakeoff for initial state
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
      <Card className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-lg h-96">
        <PlaneTakeoff className="w-16 h-16 text-slate-400 mb-5" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">
          Search for Flights
        </h3>
        <p className="text-slate-500">
          Enter your journey details to find available flights.
        </p>

        <Link to={"/flights"}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              className={cn(
                "border rounded-4xl  hover:bg-light-blue hover:border-light-blue bg-light-blue hover:text-white text-white transition-all duration-200"
              )}
              variant="ghost"
            >
              <FontAwesomeIcon icon={faPlane} className="mr-2" />
              Search Flights
            </Button>
          </motion.div>
        </Link>
      </Card>
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
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlightResultsDisplay;
