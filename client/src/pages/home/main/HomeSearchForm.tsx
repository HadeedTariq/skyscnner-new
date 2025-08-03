import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { SwapButton } from "@/pages/home/main/home-search/SwapButton";
import { FlightOptions } from "@/pages/home/main/home-search/FlightOptions";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { DateInputField } from "@/pages/home/main/home-search/DateInputField";
import { SearchButton } from "@/pages/home/main/home-search/Searchbtn";
import { useFlightStore } from "@/store/flightStore";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LocationSearchInput, type Location } from "./search-input-field";
import { getUserLocation } from "@/lib/getLocation";
import { useAirports } from "@/store/airportStore";
import { useTranslation } from "react-i18next"; // Import useTranslation

// Types
interface TravelerDetails {
  adults: number;
  children: Array<{ age: number }>;
}

interface FormData {
  origin: Location | null;
  destination: Location | null;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  nearbyAirports: boolean;
  directFlightsOnly: boolean;
  travelerDetails?: TravelerDetails;
}

interface FormErrors {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  general?: string;
}

interface PopoverState {
  guests: boolean;
}

// Constants
const MIN_ADULTS = 1;
const MAX_ADULTS = 9;
const MIN_CHILD_AGE = 1;
const MAX_CHILD_AGE = 17;
const MAX_CHILDREN = 8;
const DEFAULT_CHILD_AGE = 5;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 24,
    },
  },
};

// Custom hooks for form logic
const useFormValidation = () => {
  const { t } = useTranslation("flight_search");

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const validateForm = useCallback(
    (formData: FormData): FormErrors => {
      const errors: FormErrors = {};

      // Origin validation
      if (!formData.origin?.code) {
        errors.origin = t("validation_origin_required");
      }

      // Destination validation
      if (!formData.destination?.code) {
        errors.destination = t("validation_destination_required");
      }

      // Same origin/destination validation
      if (
        formData.origin?.code &&
        formData.destination?.code &&
        formData.origin.code === formData.destination.code
      ) {
        errors.destination = t("validation_origin_destination_same");
      }

      // Departure date validation
      if (!formData.departureDate) {
        errors.departureDate = t("validation_departure_date_required");
      } else if (formData.departureDate < today) {
        errors.departureDate = t("validation_departure_date_past");
      }

      // Return date validation
      if (
        formData.returnDate &&
        formData.departureDate &&
        formData.returnDate < formData.departureDate
      ) {
        errors.returnDate = t("validation_return_date_before_departure");
      }

      return errors;
    },
    [today, t] // Add t to dependency array
  );

  return { validateForm, today };
};

const useTravelerManagement = () => {
  const { t } = useTranslation("flight_search"); // Use translation hook here

  const [adults, setAdults] = useState(MIN_ADULTS);
  const [children, setChildren] = useState<number[]>([]);

  const incrementAdults = useCallback(() => {
    setAdults((prev) => Math.min(prev + 1, MAX_ADULTS));
  }, []);

  const decrementAdults = useCallback(() => {
    setAdults((prev) => Math.max(prev - 1, MIN_ADULTS));
  }, []);

  const setChildAge = useCallback((index: number, age: number) => {
    const clampedAge = Math.max(MIN_CHILD_AGE, Math.min(age, MAX_CHILD_AGE));
    setChildren((prev) => {
      const updated = [...prev];
      updated[index] = clampedAge;
      return updated;
    });
  }, []);

  const addChild = useCallback(() => {
    setChildren((prev) =>
      prev.length < MAX_CHILDREN ? [...prev, DEFAULT_CHILD_AGE] : prev
    );
  }, []);

  const removeChild = useCallback(() => {
    setChildren((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const travelerDetails = useMemo(
    (): TravelerDetails => ({
      adults,
      children: children.map((age) => ({ age })),
    }),
    [adults, children]
  );

  const travelerSummary = useMemo(() => {
    const adultText = t("adult_count", { count: adults });
    const childText = t("child_count", { count: children.length });
    return `${adultText}, ${childText}`;
  }, [adults, children.length, t]);

  return {
    adults,
    children,
    travelerDetails,
    travelerSummary,
    incrementAdults,
    decrementAdults,
    setChildAge,
    addChild,
    removeChild,
    canAddChild: children.length < MAX_CHILDREN,
    canRemoveChild: children.length > 0,
    canDecrementAdults: adults > MIN_ADULTS,
    canIncrementAdults: adults < MAX_ADULTS,
  };
};

export default function HomeSearchForm() {
  const { t } = useTranslation("flight_search"); // Use translation hook here

  const navigate = useNavigate();
  const { validateForm, today } = useFormValidation();
  const {
    adults,
    children,
    travelerDetails,
    travelerSummary,
    incrementAdults,
    decrementAdults,
    setChildAge,
    addChild,
    removeChild,
    canAddChild,
    canRemoveChild,
    canDecrementAdults,
    canIncrementAdults,
  } = useTravelerManagement();

  const [formData, setFormData] = useState<FormData>({
    origin: null,
    destination: null,
    departureDate: new Date(),
    returnDate: undefined,
    nearbyAirports: false,
    directFlightsOnly: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isOpen, setIsOpen] = useState<PopoverState>({ guests: false });

  const departureRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);

  const fetchFlights = useFlightStore((state) => state.fetchFlights);
  const getNearbyAirports = useAirports((state) => state.nearby);
  const setNearByAirports = useAirports((state) => state.setNearByAirports);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      returnDate:
        prev.returnDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));
  }, []);
  useEffect(() => {
    let mounted = true;

    const fetchUserLocation = async () => {
      try {
        const response = await getUserLocation();
        if (response && mounted) {
          const airports = getNearbyAirports(response.lat, response.lng);
          setNearByAirports(airports);
        }
      } catch (error) {
        console.error("Failed to get user location:", error);
        if (mounted) {
          toast(t("location_access_failed_toast_title"), {
            description: t("location_access_failed_toast_description"),
            duration: 3000,
          });
        }
      }
    };

    fetchUserLocation();

    return () => {
      mounted = false;
    };
  }, [getNearbyAirports, setNearByAirports, t]);

  const handleLocationChange = useCallback(
    (field: "origin" | "destination") => (location: Location | null) => {
      setFormData((prev) => ({ ...prev, [field]: location }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleDateChange = useCallback(
    (field: "departureDate" | "returnDate") => (date: Date | undefined) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: date };

        if (
          field === "departureDate" &&
          date &&
          prev.returnDate &&
          date > prev.returnDate
        ) {
          newData.returnDate = undefined;
          setErrors((e) => ({ ...e, returnDate: undefined }));
        }

        return newData;
      });

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleCheckboxChange = useCallback(
    (field: keyof FormData) => (checked: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: checked }));
    },
    []
  );

  const handleSwap = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
    setRotated((prev) => !prev);

    // Clear location-related errors
    setErrors((prev) => ({
      ...prev,
      origin: undefined,
      destination: undefined,
    }));
  }, []);

  const applyGuestSelection = useCallback(() => {
    setFormData((prev) => ({ ...prev, travelerDetails }));
    setIsOpen((prev) => ({ ...prev, guests: false }));
  }, [travelerDetails]);

  const scrollToFirstError = useCallback((errors: FormErrors) => {
    const firstErrorField = Object.keys(errors)[0];
    const element = document.getElementById(firstErrorField);
    if (element) {
      const yOffset = -150;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      element.focus();
    }
  }, []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        toast(t("validation_fix_errors_toast_title"), {
          description: t("validation_fix_errors_toast_description"),
          descriptionClassName: "text-sm text-black",

          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          className: "bg-red-100 border border-red-300 text-red-800",
          action: (
            <Button
              variant="link"
              className="text-red-800 hover:text-red-900"
              onClick={() => scrollToFirstError(validationErrors)}
            >
              {t("validation_fix_it_button")}
            </Button>
          ),
        });

        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const payload = {
          fromLocation: formData.origin!.code,
          toLocation: formData.destination!.code,
          departureDate: formData.departureDate!.toISOString().split("T")[0],
          returnDate: formData.returnDate?.toISOString().split("T")[0],
          userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          traverlerDetails: travelerDetails,
          nearbyAirports: formData.nearbyAirports,
          directFlightsOnly: formData.directFlightsOnly,
        };

        await fetchFlights(payload);
        navigate("/flight/search");
      } catch (error) {
        console.error("Flight search failed:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : t("flight_search_failed_toast_description_unknown"); // Translate unknown error

        toast(t("flight_search_failed_toast_title"), {
          description: errorMessage,
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });

        setErrors({ general: t("flight_search_failed_general_error") });
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData,
      validateForm,
      travelerDetails,
      fetchFlights,
      navigate,
      scrollToFirstError,
      t, // Add t to dependency array
    ]
  );

  return (
    <motion.form
      onSubmit={handleSearch}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-dark-blue p-6 md:p-8 rounded-3xl text-white max-w-6xl mx-auto shadow-lg"
      noValidate
      role="search"
      aria-label={t("form_title")}
    >
      {/* General error display */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700"
          role="alert"
        >
          {errors.general}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
        {/* Origin */}
        <motion.div className="relative md:col-span-3" variants={itemVariants}>
          <LocationSearchInput
            id="origin"
            label={t("origin_label")}
            placeholder={t("origin_placeholder")}
            value={formData.origin}
            onChange={handleLocationChange("origin")}
            error={errors.origin}
            className="rounded-t-2xl md:rounded-t-none md:rounded-l-2xl py-0.5 pr-6 pl-2 bg-white"
            // required
          />
          <div className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
            <SwapButton
              rotated={rotated}
              onClick={handleSwap}
              // disabled={isLoading}
              aria-label={t("swap_locations_aria_label")}
            />
          </div>
        </motion.div>

        {/* Destination */}
        <motion.div className="md:col-span-3" variants={itemVariants}>
          <LocationSearchInput
            id="destination"
            label={t("destination_label")}
            placeholder={t("destination_placeholder")}
            value={formData.destination}
            onChange={handleLocationChange("destination")}
            className="md:pl-4 py-0.5 bg-white"
            error={errors.destination}
            // required
          />
        </motion.div>

        {/* Departure Date */}
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <DateInputField
            id="departureDate"
            label={t("departure_label")}
            value={formData.departureDate}
            onChange={handleDateChange("departureDate")}
            error={errors.departureDate}
            buttonRef={departureRef}
            minDate={today}
            disabled={isLoading}
            required
          />
        </motion.div>

        {/* Return Date */}
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <DateInputField
            id="returnDate"
            label={t("return_label")}
            placeholder={t("return_placeholder_oneway")}
            value={formData.returnDate}
            onChange={handleDateChange("returnDate")}
            className="md:rounded-b-none"
            error={errors.returnDate}
            buttonRef={returnRef}
            minDate={formData.departureDate || today}
            disabled={isLoading}
          />
        </motion.div>

        {/* Travelers */}
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <Popover
            open={isOpen.guests}
            onOpenChange={(open: boolean) =>
              setIsOpen((prev) => ({ ...prev, guests: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-white text-black h-17 md:col-span-1 rounded-none rounded-b-2xl md:rounded-b-none md:rounded-r-2xl"
                disabled={isLoading}
                aria-label={t("travelers_select_aria_label", {
                  summary: travelerSummary,
                })}
              >
                {travelerSummary}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                {/* Adults */}
                <div>
                  <h3 className="font-medium mb-2">{t("adults_heading")}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {t("adults_age_info")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={decrementAdults}
                        disabled={!canDecrementAdults}
                        aria-label={t("decrease_adults_aria_label")}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{adults}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={incrementAdults}
                        disabled={!canIncrementAdults}
                        aria-label={t("increase_adults_aria_label")}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <h3 className="font-medium mb-2">{t("children_heading")}</h3>
                  <div className="space-y-2">
                    {children.map((age, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">
                          {t("child_label", { index: index + 1 })}
                        </span>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`child-age-${index}`}
                            className="sr-only"
                          >
                            {t("child_age_aria_label", { index: index + 1 })}
                          </label>
                          <input
                            id={`child-age-${index}`}
                            type="number"
                            value={age}
                            min={MIN_CHILD_AGE}
                            max={MAX_CHILD_AGE}
                            onChange={(e) =>
                              setChildAge(index, Number(e.target.value))
                            }
                            className="w-16 p-1 rounded border text-black text-center"
                          />
                          <span className="text-xs text-gray-500">
                            {t("child_age_unit")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1"
                      onClick={addChild}
                      disabled={!canAddChild}
                    >
                      {t("add_child_button")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1"
                      onClick={removeChild}
                      disabled={!canRemoveChild}
                    >
                      {t("remove_child_button")}
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={applyGuestSelection}>
                  {t("apply_button", { summary: travelerSummary })}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>

      <div className="py-2 md:py-4">
        {/* Search Button */}
        <motion.div className="md:col-span-1 mt-1" variants={itemVariants}>
          <SearchButton
            isLoading={isLoading}
            aria_label={t("search_button_aria_label")}
          ></SearchButton>
        </motion.div>
      </div>

      <FlightOptions
        nearbyAirports={formData.nearbyAirports}
        directOnly={formData.directFlightsOnly}
        onToggleNearby={handleCheckboxChange("nearbyAirports")}
        onToggleDirect={handleCheckboxChange("directFlightsOnly")}
        directFlightsOnlyText={t("direct_flights")}
        nearbyAirportsText={t("include_airports")}
      />
    </motion.form>
  );
}
