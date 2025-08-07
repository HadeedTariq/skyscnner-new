import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import LocationDropdown from "./LocationDropDown"; // Assuming this is your custom component
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/calender"; // Original path: @/components/calender (potential typo: calendar?)
import { CalendarIcon, Clock, Loader2, Search } from "lucide-react";
import { CarSearchPayload, useCarStore } from "@/store/carStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added framer-motion

// Zod Schema and Types (No changes)
const FormSchema = z.object({
  pickupLocation: z.object({
    name: z.string().min(1, "Pickup location is required"),
    code: z.string().min(1, "Pickup location code is required"),
  }),
  pickupDate: z.date(),
  pickupTime: z.string().min(1, "Pickup time is required"),
  dropoffLocation: z.object({
    name: z.string().min(1, "Drop-off location is required"),
    code: z.string().min(1, "Drop-off location code is required"),
  }),
  dropoffDate: z.date(),
  dropoffTime: z.string().min(1, "Drop-off time is required"),
  returnToSameLocation: z.boolean(),
});

type FormData = z.infer<typeof FormSchema>;

// Time Options Generator (No changes)
const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const hourFormatted = hour.toString().padStart(2, "0");
      const minuteFormatted = minute.toString().padStart(2, "0");
      const time = `${hourFormatted}:${minuteFormatted}`;
      const displayTime = `${hour % 12 || 12}:${minuteFormatted} ${
        hour < 12 ? "AM" : "PM"
      }`;
      options.push({ value: time, label: displayTime });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// Animation Variants
const formContainerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08, // Slightly faster stagger
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const conditionalTextVariants = {
  initial: { opacity: 0, height: 0, y: -10 },
  animate: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function CarSearchForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      pickupLocation: { name: "", code: "" },
      pickupDate: new Date(),
      pickupTime: "12:00",
      dropoffLocation: { name: "", code: "" },
      dropoffDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      dropoffTime: "12:00",
      returnToSameLocation: false,
    },
    resolver: zodResolver(FormSchema as any),
  });

  const navigate = useNavigate();
  const { fetchCars } = useCarStore();
  const { loading } = useCarStore();

  const returnToSameLocation = watch("returnToSameLocation");
  const pickupLocation = watch("pickupLocation");
  const pickUpDate = watch("pickupDate");

  useEffect(() => {
    setValue(
      "dropoffDate",
      new Date(pickUpDate.setDate(pickUpDate.getDate() + 1)),
      { shouldValidate: true }
    );
  }, [pickUpDate]);

  useEffect(() => {
    if (returnToSameLocation && pickupLocation.name) {
      setValue("dropoffLocation", pickupLocation, { shouldValidate: true });
    }
  }, [returnToSameLocation, pickupLocation, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    const payload = {
      pickUpLocation: data.pickupLocation.code,
      pickUpDate: data.pickupDate.toISOString().split("T")[0],
      pickUpTime: data.pickupTime,
      dropOffLocation: data.dropoffLocation.code,
      dropOffDate: data.dropoffDate.toISOString().split("T")[0],
      dropOffTime: data.dropoffTime,
      returnToSameLocation: data.returnToSameLocation,
    } as CarSearchPayload;

    console.log("Payload:", payload);
    try {
      await fetchCars(payload);
      navigate("/cars/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.form
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-dark-blue p-6 md:p-8 rounded-3xl text-white max-w-6xl mx-auto shadow-lg"
    >
      <div className="w-full grid grid-cols-2  md:grid-cols-3 gap-4 md:gap-2.5 items-start">
        {" "}
        {/* Changed items-end to items-start for better alignment with error messages */}
        {/* Pickup Location */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">
            Pick-up location
          </Label>
          <Controller
            name="pickupLocation"
            control={control}
            render={({ field }) => (
              <LocationDropdown
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  if (returnToSameLocation) {
                    setValue("dropoffLocation", value, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            )}
          />
          <AnimatePresence>
            {errors.pickupLocation?.name && (
              <motion.p
                key="error-pickupLocation-name"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.pickupLocation.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Pickup Date */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">
            Pick-up date
          </Label>
          <Controller
            name="pickupDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-black justify-start font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(field.value)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <AnimatePresence>
            {errors.pickupDate && (
              <motion.p
                key="error-pickupDate"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.pickupDate.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Pickup Time */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">Time</Label>
          <Controller
            name="pickupTime"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white text-black h-12 py w-full">
                  {" "}
                  {/* Note: 'py' might be a typo in original - should be like py-2? */}
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <AnimatePresence>
            {errors.pickupTime && (
              <motion.p
                key="error-pickupTime"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.pickupTime.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Dropoff Location */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">
            Drop-off location
          </Label>
          <Controller
            name="dropoffLocation"
            control={control}
            render={({ field }) => (
              <motion.div
                animate={{ opacity: returnToSameLocation ? 0.65 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <LocationDropdown
                  value={field.value}
                  onChange={field.onChange}
                  disabled={returnToSameLocation}
                  className={returnToSameLocation ? "cursor-not-allowed" : ""}
                />
              </motion.div>
            )}
          />
          <AnimatePresence mode="wait">
            {" "}
            {/* mode="wait" ensures one exits before other enters */}
            {errors.dropoffLocation?.name && !returnToSameLocation && (
              <motion.p
                key="error-dropoffLocation-name"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.dropoffLocation.name.message}
              </motion.p>
            )}
            {returnToSameLocation && (
              <motion.p
                key="info-sameLocation"
                {...conditionalTextVariants}
                className="text-xs text-gray-400 mt-1"
              >
                Same as pick-up location
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Dropoff Date */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">
            Drop-off date
          </Label>
          <Controller
            name="dropoffDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white text-black py-0 justify-start font-normal" // Original 'py-0' kept
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(field.value)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <AnimatePresence>
            {errors.dropoffDate && (
              <motion.p
                key="error-dropoffDate"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.dropoffDate.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Dropoff Time */}
        <motion.div variants={formItemVariants}>
          <Label className="text-xs text-gray-300 mb-1 block">Time</Label>
          <Controller
            name="dropoffTime"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white text-black h-12 w-full">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <AnimatePresence>
            {errors.dropoffTime && (
              <motion.p
                key="error-dropoffTime"
                {...conditionalTextVariants}
                className="text-red-400 text-xs mt-1"
              >
                {errors.dropoffTime.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Return to Same Location */}
        <motion.div
          variants={formItemVariants}
          className="flex items-center gap-2 md:mt-4 col-span-full" // Added vertical margin for better spacing
        >
          <Controller
            name="returnToSameLocation"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  const newCheckedState = !!checked; // Ensure boolean
                  field.onChange(newCheckedState);
                  if (newCheckedState) {
                    setValue("dropoffLocation", watch("pickupLocation"), {
                      shouldValidate: true,
                    });
                  }
                }}
                id="return-checkbox"
              />
            )}
          />
          <Label htmlFor="return-checkbox" className="text-sm cursor-pointer">
            Return to same location
          </Label>
        </motion.div>
        {/* Submit Button */}
        <motion.div
          variants={formItemVariants}
          className="md:mt-6 col-span-full" // Added a bit more top margin
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              duration: 0.15,
            }}
          >
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-1 h-4" />
                  Search Cars
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.form>
  );
}
