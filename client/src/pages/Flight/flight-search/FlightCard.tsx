import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ArrowRight,
  Plane,
  ChevronDown,
  ChevronUp,
  Briefcase,
  CalendarDays,
  Ticket,
  Star,
} from "lucide-react";
import { useAirports } from "@/store/airportStore";
import { useNavigate } from "react-router-dom";
import { FlightResult } from "@/store/flightStore";

interface FlightCardProps {
  flight: FlightResult;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14, duration: 0.5 },
  },
  hover: {
    y: -8, // More pronounced lift
    boxShadow: "0 15px 30px rgba(0,0,0,0.12)", // Stronger shadow
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const detailsVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.25, ease: "easeOut" }, // Slightly longer for smoother hide
  },
  visible: {
    opacity: 1,
    height: "auto",
    paddingTop: "1.5rem", // Matches p-6 for consistent spacing
    paddingBottom: "1.5rem",
    transition: { duration: 0.45, ease: "easeOut" }, // Longer for smoother reveal
  },
};

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const navigate = useNavigate();
  const getAirportByIata = useAirports((state) => state.getAiportByIata);
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to format ISO date string to a readable date
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A"; // Handle invalid dates gracefully
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      exit="exit"
      layout
      className="w-full"
    >
      <Card className="border border-slate-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white relative">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row justify-between items-stretch p-5 sm:p-6 gap-6">
              <div className="flex-1 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-sky-800 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-sm">
                      {flight.airlineName}
                    </span>
                    {flight.isUpsellOffer && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-amber-200">
                        <Star
                          size={12}
                          className="text-amber-500 fill-amber-500"
                        />
                        Premium
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-600 capitalize px-2 py-1 rounded-md bg-slate-100">
                    {flight.cabinClass.toLowerCase()} Class
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center text-center sm:text-left gap-2 sm:gap-4">
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="text-sm font-extrabold text-slate-900 leading-tight">
                      {flight.departureTime}
                    </div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide mt-1">
                      {getAirportByIata(flight.from)?.city || flight.from}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {flight.from}
                    </div>
                  </div>

                  <div className="flex flex-col items-center flex-shrink-0 text-slate-400">
                    <Plane className="h-6 w-6 transform group-hover:-rotate-12 transition-transform duration-300 text-sky-500" />
                    <div className="text-sm font-medium mt-1 text-slate-600 whitespace-nowrap">
                      {flight.totalDuration}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {flight.numberOfStops === 0
                        ? "Direct"
                        : `${flight.numberOfStops} stop${
                            flight.numberOfStops > 1 ? "s" : ""
                          }`}
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex flex-col items-center sm:items-end text-right">
                    <div className="text-sm font-extrabold text-slate-900 leading-tight">
                      {flight.arrivalTime}
                    </div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide mt-1">
                      {getAirportByIata(flight.to)?.city || flight.to}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {flight.to}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="sm:border-l sm:border-slate-100 sm:pl-8 flex flex-col items-center sm:items-end justify-between gap-4 w-full sm:w-auto sm:min-w-[180px] mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-center sm:text-right">
                  <div className="text-3xl sm:text-4xl font-extrabold text-sky-700 leading-tight">
                    {flight.totalPrice}
                    <span className="text-lg font-semibold ml-1 text-slate-600">
                      {flight.currency}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">Total Price</div>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="bg-sky-600 hover:bg-sky-700 text-white w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  onClick={() => {
                    navigate(`/payments`); // Ensure this path is correct for your app
                  }}
                >
                  Select Flight{" "}
                  <ArrowRight
                    size={20}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>

                {/* Collapsible Trigger - SkyScanner style */}
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-sky-700 p-2 h-auto text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 mt-2"
                  >
                    <span>{isOpen ? "Hide Details" : "Show Details"}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-500" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expandable Details Section */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="details"
                  variants={detailsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden" // Essential for height animation
                >
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Flight Specifics */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
                          <Ticket size={16} className="text-sky-500" />
                          Flight Specifics
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Airline:</span>
                            <span className="font-medium">
                              {flight.airlineName} ({flight.airlineCode})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Flight Number:</span>
                            <span className="font-medium">
                              {flight.flightNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Route:</span>
                            <span className="font-medium">
                              {flight.from} to {flight.to}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Baggage Allowance */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
                          <Briefcase size={16} className="text-sky-500" />
                          Baggage Allowance
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Checked Bags:</span>
                            <span className="font-medium">
                              {flight.checkedBags}{" "}
                              {flight.checkedBags === 1 ? "bag" : "bags"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cabin Bags:</span>
                            <span className="font-medium">
                              {flight.cabinBags}{" "}
                              {flight.cabinBags === 1 ? "bag" : "bags"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cabin Class:</span>
                            <span className="font-medium capitalize">
                              {flight.cabinClass.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Key Dates & Journey Info */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
                          <CalendarDays size={16} className="text-sky-500" />
                          Journey & Dates
                        </h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex justify-between">
                            <span>Total Duration:</span>
                            <span className="font-medium">
                              {flight.totalDuration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Number of Stops:</span>
                            <span className="font-medium">
                              {flight.numberOfStops === 0
                                ? "Direct"
                                : flight.numberOfStops}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Ticketing Date:</span>
                            <span className="font-medium">
                              {formatDate(flight.lastTicketingDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Flight ID:</span>
                            <span className="font-medium">
                              {flight.id || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
};

export default FlightCard;
