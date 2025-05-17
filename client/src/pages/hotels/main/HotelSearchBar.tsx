import { useState } from "react";
import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location } from "@/pages/home/main/HomeSearchForm";
import { useNavigate } from "react-router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/calender";
import { LocationSearchInput } from "@/pages/home/main/search-input-field";
import { useHotelStore } from "@/store/hotelStore";
import { HotelSearchPayload } from "@/store/hotelStore";
// Type definitions
type RoomType = "SINGLE" | "DOUBLE" | "SUITE" | "ALL";

interface GuestDetails {
  adults: number;
  children: number;
}

interface FormData {
  destination: Location;
  checkIn: Date;
  checkout: Date;
  guestDetails: GuestDetails;
  rooms: number;
  roomType: RoomType;
  userTimezone: string;
}

interface PopoverState {
  checkIn: boolean;
  checkOut: boolean;
  guests: boolean;
}

interface CounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
}

interface DatePickerProps {
  label: string;
  field: "checkIn" | "checkout";
  value: Date;
}

// const ROOM_TYPES: RoomType[] = ["SINGLE", "DOUBLE", "SUITE", "ALL"];

export default function HotelSearchForm() {
  // Simplified state management
  const [formData, setFormData] = useState<FormData>({
    destination: {
      name: "",
      code: "",
    },
    checkIn: new Date(),
    checkout: new Date(new Date().setDate(new Date().getDate() + 1)),
    guestDetails: {
      adults: 2,
      children: 0,
    },
    rooms: 1,
    roomType: "ALL",
    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const fetchHotels = useHotelStore((state) => state.fetchHotels);
  const navigate = useNavigate();

  const [openPopover, setOpenPopover] = useState<PopoverState>({
    checkIn: false,
    checkOut: false,
    guests: false,
  });

  // Helper functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const togglePopover = (name: keyof PopoverState, value: boolean): void => {
    setOpenPopover((prev) => ({ ...prev, [name]: value }));
  };

  const updateFormData = (field: string, value: any): void => {
    setFormData((prev) => {
      // Handle nested properties with dot notation (e.g., "guestDetails.adults")
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        const parentKey = parent as keyof FormData;

        // Type-guard to ensure we're dealing with an object
        if (typeof prev[parentKey] === "object" && prev[parentKey] !== null) {
          return {
            ...prev,
            [parentKey]: {
              ...prev[parentKey],
              [child]: value,
            },
          };
        }
        return prev; // Return unchanged if not a valid parent key
      }

      // Handle regular properties
      if (field as keyof FormData) {
        return { ...prev, [field]: value };
      }

      return prev; // Return unchanged if not a valid field
    });
  };

  const handleDateChange =
    (field: "checkIn" | "checkout") =>
    (date: Date | undefined): void => {
      if (!date) return;
      updateFormData(field, date);
      togglePopover(field === "checkIn" ? "checkIn" : "checkOut", false);
    };

  const handleLocationChange = (field: "destination") => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        name: value,
      },
    }));
  };

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const payload = {
      checkIn: formData.checkIn.toISOString().split("T")[0],
      checkout: formData.checkout.toISOString().split("T")[0],
      destination: formData.destination.code,
      guestDetails: {
        adults: formData.guestDetails.adults,
        children: Array.from({ length: formData.guestDetails.children }).map(
          () => ({
            age: 10,
          })
        ),

        rooms: formData.rooms,
      },

      userTimezone: formData.userTimezone,
    } as HotelSearchPayload;

    console.log("Payload:", payload);
    try {
      fetchHotels(payload);
      navigate("/hotels/search");
    } catch (error) {
      console.log(error);
    }
    console.log("Search data:", formData);
  };

  // Calculate guest summary text
  const guestSummary = `${formData.guestDetails.adults} adults${
    formData.guestDetails.children > 0
      ? `, ${formData.guestDetails.children} children`
      : ""
  }, ${formData.rooms} room${formData.rooms > 1 ? "s" : ""}`;

  // Reusable counter component
  const Counter = ({ label, value, onChange, minValue = 0 }: CounterProps) => (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onChange(value - 1)}
          disabled={value <= minValue}
        >
          -
        </Button>
        <span>{value}</span>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onChange(value + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );

  // Reusable date picker component
  const DatePicker = ({ label, field, value }: DatePickerProps) => (
    <div>
      <label className="text-xs text-gray-300 mb-1 block">{label}</label>
      <Popover
        open={openPopover[field === "checkIn" ? "checkIn" : "checkOut"]}
        onOpenChange={(open) =>
          togglePopover(field === "checkIn" ? "checkIn" : "checkOut", open)
        }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-white text-black hover:bg-gray-100 h-12"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={value}
            onSelect={handleDateChange(field)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="bg-dark-blue p-6 md:p-8 rounded-3xl text-white max-w-7xl mx-auto shadow-lg">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 xl:grid-cols-9 gap-2 items-end">
        {/* Destination input */}
        <div className="md:col-span-2">
          <div className="relative">
            <label className="text-xs text-gray-300 mb-1 block">
              Destination
            </label>
            {/* <LocationSearchInput
            id="origin"
            label="From"
            value={formData.origin}
            onChange={handleLocationChange("origin")}
            onSelect={(location) => {
              // Store the full location object with both code and name
              setFormData((prev) => ({
                ...prev,
                origin: {
                  name: location.name,
                  code: location.code,
                },
              }));
            }}
            error={errors.origin}
            className="rounded-t-2xl md:rounded-t-none md:rounded-l-2xl pr-6"
          /> */}
            <LocationSearchInput
              id="destination"
              label=""
              showLabel={false}
              value={formData.destination}
              onChange={handleLocationChange("destination")}
              onSelect={(location) => {
                // Store the full location object with both code and name
                setFormData((prev) => ({
                  ...prev,
                  destination: {
                    name: location.name,
                    code: location.code,
                  },
                }));
              }}
              className="rounded-md pr-6 py-3"
            />
          </div>
        </div>

        {/* Guests dropdown */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-300 mb-1 block">
            Guests & Rooms
          </label>
          <Popover
            open={openPopover.guests}
            onOpenChange={(open: boolean) => togglePopover("guests", open)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-white text-black hover:bg-gray-100 h-12"
              >
                {guestSummary}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Guests</h3>
                  <Counter
                    label="Adults"
                    value={formData.guestDetails.adults}
                    onChange={(value: number) =>
                      updateFormData("guestDetails.adults", value)
                    }
                    minValue={1}
                  />
                  <Counter
                    label="Children"
                    value={formData.guestDetails.children}
                    onChange={(value: number) =>
                      updateFormData("guestDetails.children", value)
                    }
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Rooms</h3>
                  <Counter
                    label="Rooms"
                    value={formData.rooms}
                    onChange={(value: number) => updateFormData("rooms", value)}
                    minValue={1}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => togglePopover("guests", false)}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-in date selector */}
        <div className="md:col-span-1 w-full xl:col-span-2">
          <DatePicker
            label="Check-in"
            field="checkIn"
            value={formData.checkIn}
          />
        </div>

        {/* Check-out date selector */}
        <div className="md:col-span-1 xl:col-span-2">
          <DatePicker
            label="Check-out"
            field="checkout"
            value={formData.checkout}
          />
        </div>

        {/* Search Button */}
        <div className="mt-4 md:mt-0 md:col-span-2 xl:col-span-1 w-fit">
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12 px-4"
          >
            <Search className="mr-1 h-4" />
            Search Hotels
          </Button>
        </div>
      </div>
    </div>
  );
}
