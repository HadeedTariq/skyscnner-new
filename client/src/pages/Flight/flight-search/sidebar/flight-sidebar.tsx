import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useFlightStore } from "@/store/flightStore";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const FlightsSidebar = () => {
  const applyFlightFilters = useFlightStore(
    (state) => state.applyFlightFilters
  );
  const activeFilters = useFlightStore((state) => state.activeFilters);
  const clearFlightFilters = useFlightStore(
    (state) => state.clearFlightFilters
  );
  const getFilterOptions = useFlightStore((state) => state.getFilterOptions);
  const allFetchedFlights = useFlightStore((state) => state.allFetchedFlights);

  const filterOptions = useMemo(() => {
    return getFilterOptions();
  }, [allFetchedFlights, getFilterOptions]);

  const [priceValues, setPriceValues] = useState<[number, number]>([
    filterOptions.minPrice,
    filterOptions.maxPrice,
  ]);
  const [durationValues, setDurationValues] = useState<[number, number]>([
    filterOptions.minDuration,
    filterOptions.maxDuration,
  ]);

  useEffect(() => {
    setPriceValues([
      activeFilters.priceRange?.min ?? filterOptions.minPrice,
      activeFilters.priceRange?.max ?? filterOptions.maxPrice,
    ]);
    setDurationValues([
      activeFilters.durationRange?.min ?? filterOptions.minDuration,
      activeFilters.durationRange?.max ?? filterOptions.maxDuration,
    ]);
  }, [filterOptions, activeFilters.priceRange, activeFilters.durationRange]);

  const handleAirlineChange = (airline: string, checked: boolean) => {
    const newAirlines = checked
      ? [...activeFilters.airlines, airline]
      : activeFilters.airlines.filter((a) => a !== airline);
    applyFlightFilters({ airlines: newAirlines });
  };

  const handleStopsChange = (stopValue: number | "any", checked: boolean) => {
    let newStops: (number | "any")[];
    if (stopValue === "any") {
      newStops = checked
        ? ["any"]
        : activeFilters.stops.filter((s) => s !== "any");
      if (checked && newStops.filter((s) => s !== "any").length > 0)
        newStops = ["any"]; // "any" clears specific stops
    } else {
      const currentStops = activeFilters.stops.filter((s) => s !== "any");
      newStops = checked
        ? [...currentStops, stopValue]
        : currentStops.filter((s) => s !== stopValue);
    }
    applyFlightFilters({ stops: newStops.length > 0 ? newStops : ["any"] });
  };

  const handleCabinClassChange = (cabinClass: string, checked: boolean) => {
    const newCabinClasses = checked
      ? [...activeFilters.cabinClasses, cabinClass]
      : activeFilters.cabinClasses.filter((cc) => cc !== cabinClass);
    applyFlightFilters({ cabinClasses: newCabinClasses });
  };

  const handlePriceSliderChange = (value: number[]) => {
    setPriceValues(value as [number, number]);
  };
  const handleDurationSliderChange = (value: number[]) => {
    setDurationValues(value as [number, number]);
  };

  const handlePriceRangeCommit = (values: [number, number]) => {
    if (
      values[0] === filterOptions.minPrice &&
      values[1] === filterOptions.maxPrice
    ) {
      applyFlightFilters({ priceRange: null });
    } else {
      applyFlightFilters({ priceRange: { min: values[0], max: values[1] } });
    }
  };

  const handleDurationRangeCommit = (values: [number, number]) => {
    if (
      values[0] === filterOptions.minDuration &&
      values[1] === filterOptions.maxDuration
    ) {
      applyFlightFilters({ durationRange: null });
    } else {
      applyFlightFilters({ durationRange: { min: values[0], max: values[1] } });
    }
  };

  const formatDurationLabel = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m > 0 ? `${m}m` : ""}`.trim() || "0h";
  };

  const stopsOptions = [
    { label: "Any stops", value: "any" as const },
    { label: "Direct", value: 0 as const },
    { label: "1 Stop", value: 1 as const },
    { label: "2+ Stops", value: 2 as const },
  ];

  console.log(filterOptions);

  return (
    <motion.div className=" p-4 sm:p-5 rounded-xl shadow-lg sticky top-6 lg:top-8 w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <SlidersHorizontal className="h-5 w-5 text-sky-600 mr-2.5" />
          Filters
        </h2>
        <Button
          onClick={clearFlightFilters}
          variant="ghost"
          size="sm"
          className="text-sky-600 hover:bg-light-blue/20 px-2"
        >
          <RotateCcw className="h-4 w-4 mr-1.5 " /> Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["stops", "airlines", "price"]}
        className="w-full space-y-1"
      >
        <AccordionItem value="stops" className="border-none">
          <AccordionTrigger className="font-semibold text-gray-700 hover:no-underline py-2.5 text-base rounded-md hover:bg-light-blue/20 px-3">
            Number of Stops
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-1 space-y-2.5 px-3">
            {stopsOptions.map((opt) => (
              <motion.div
                key={`stop-opt-${opt.value}`}
                variants={itemVariants}
                className="flex items-center space-x-2.5"
              >
                <Checkbox
                  id={`stops-${opt.value}`}
                  checked={activeFilters.stops.includes(opt.value)}
                  onCheckedChange={(checked: boolean) =>
                    handleStopsChange(opt.value, !!checked)
                  }
                  className="border-slate-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                />
                <Label
                  htmlFor={`stops-${opt.value}`}
                  className="text-sm font-normal text-gray-600 cursor-pointer"
                >
                  {opt.label}
                </Label>
              </motion.div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {filterOptions.airlines.length > 0 && (
          <AccordionItem value="airlines" className="border-none">
            <AccordionTrigger className="font-semibold text-gray-700 hover:no-underline py-2.5 text-base rounded-md hover:bg-light-blue/20 px-3">
              Airlines
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-1 space-y-2.5 px-3 max-h-48 overflow-y-auto pretty-scrollbar">
              {filterOptions.airlines?.map((airline) => (
                <motion.div
                  key={`airline-opt-${airline}`}
                  variants={itemVariants}
                  className="flex items-center space-x-2.5"
                >
                  <Checkbox
                    id={`airline-${airline?.replace(/\s+/g, "-")}`}
                    checked={activeFilters.airlines.includes(airline)}
                    onCheckedChange={(checked: boolean) =>
                      handleAirlineChange(airline, !!checked)
                    }
                    className="border-slate-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                  />
                  <Label
                    htmlFor={`airline-${airline?.replace(/\s+/g, "-")}`}
                    className="text-sm font-normal text-gray-600 cursor-pointer"
                  >
                    {airline}
                  </Label>
                </motion.div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {filterOptions.maxPrice > 0 &&
          filterOptions.maxPrice > filterOptions.minPrice && (
            <AccordionItem value="price" className="border-none">
              <AccordionTrigger className="font-semibold text-gray-700 hover:no-underline py-2.5 text-base rounded-md hover:bg-light-blue/20 px-3">
                Price Range
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-3 px-3 space-y-3">
                <Slider
                  min={filterOptions.minPrice}
                  max={filterOptions.maxPrice}
                  step={10}
                  value={priceValues}
                  onValueChange={handlePriceSliderChange}
                  onValueCommit={handlePriceRangeCommit}
                  className="[&_[role=slider]]:bg-sky-600 [&>span:first-child]:bg-sky-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {priceValues[0].toFixed(0)}{" "}
                    {allFetchedFlights.length > 0
                      ? allFetchedFlights[0].currency
                      : ""}
                  </span>
                  <span>
                    {priceValues[1].toFixed(0)}{" "}
                    {allFetchedFlights.length > 0
                      ? allFetchedFlights[0].currency
                      : ""}
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        {filterOptions.maxDuration > 0 &&
          filterOptions.maxDuration > filterOptions.minDuration && (
            <AccordionItem value="duration" className="border-none">
              <AccordionTrigger className="font-semibold text-gray-700 hover:no-underline py-2.5 text-base rounded-md hover:bg-light-blue/20 px-3">
                Flight Duration
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-3 px-3 space-y-3">
                <Slider
                  min={filterOptions.minDuration}
                  max={filterOptions.maxDuration}
                  step={15}
                  value={durationValues}
                  onValueChange={handleDurationSliderChange}
                  onValueCommit={handleDurationRangeCommit}
                  className="[&_[role=slider]]:bg-sky-600 [&>span:first-child]:bg-sky-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatDurationLabel(durationValues[0])}</span>
                  <span>{formatDurationLabel(durationValues[1])}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

        {filterOptions.cabinClasses.length > 0 && (
          <AccordionItem value="cabin" className="border-none">
            <AccordionTrigger className="font-semibold text-gray-700 hover:no-underline py-2.5 text-base rounded-md hover:bg-light-blue/20 px-3">
              Cabin Class
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-1 space-y-2.5 px-3">
              {filterOptions.cabinClasses.map((cc) => (
                <motion.div
                  key={`cabin-opt-${cc}`}
                  variants={itemVariants}
                  className="flex items-center space-x-2.5"
                >
                  <Checkbox
                    id={`cabin-${cc.toLowerCase().replace(/\s+/g, "-")}`}
                    checked={activeFilters.cabinClasses.includes(cc)}
                    onCheckedChange={(checked: boolean) =>
                      handleCabinClassChange(cc, !!checked)
                    }
                    className="border-slate-400 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                  />
                  <Label
                    htmlFor={`cabin-${cc.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm font-normal text-gray-600 cursor-pointer"
                  >
                    {cc}
                  </Label>
                </motion.div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
};
export default FlightsSidebar;
