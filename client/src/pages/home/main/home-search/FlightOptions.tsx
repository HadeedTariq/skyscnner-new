import { motion } from "framer-motion";

export interface FlightOptionsProps {
  nearbyAirports: boolean;
  directOnly: boolean;
  onToggleNearby: (checked: boolean) => void;
  onToggleDirect: (checked: boolean) => void;
  directFlightsOnlyText: string;
  nearbyAirportsText: string;
}

export function FlightOptions({
  nearbyAirports,
  directOnly,
  onToggleNearby,
  onToggleDirect,
  directFlightsOnlyText,
  nearbyAirportsText,
}: FlightOptionsProps) {
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5 } },
  };

  return (
    <motion.div
      className="mt-4 flex flex-wrap gap-4"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
        <input
          id="nearbyAirports"
          type="checkbox"
          className="mr-2 cursor-pointer"
          checked={nearbyAirports}
          onChange={(e) => onToggleNearby(e.target.checked)}
        />
        <label htmlFor="nearbyAirports" className="text-sm cursor-pointer">
          {nearbyAirportsText}
        </label>
      </motion.div>
      <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
        <input
          id="directFlightsOnly"
          type="checkbox"
          className="mr-2 cursor-pointer"
          checked={directOnly}
          onChange={(e) => onToggleDirect(e.target.checked)}
        />
        <label htmlFor="directFlightsOnly" className="text-sm cursor-pointer">
          {directFlightsOnlyText}
        </label>
      </motion.div>
    </motion.div>
  );
}
