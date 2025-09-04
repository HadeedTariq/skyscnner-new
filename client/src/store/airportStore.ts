/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Airport {
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
}

interface AirportsState {
  airports: Airport[];
  nearByAirports: Airport[];
  loading: boolean;
  error: string | null;

  getAiportByIata: (iata: string) => Airport | undefined;
  setNearByAirports: (nearByAirportsData: Airport[]) => void;
  fetchAll: () => Promise<void>;
  suggest: (query: string, limit?: number) => Airport[];
  nearby: (lat: number, lon: number, radiusKm?: number) => Airport[];
}

const API_URL =
  "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json";

/** Convert degrees to radians */
const deg2rad = (deg: number): number => (deg * Math.PI) / 180;

/** Haversine distance in KM between two geo points */
const distanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useAirports = create<AirportsState>()(
  persist(
    (set, get) => ({
      airports: [],
      loading: false,
      nearByAirports: [],
      error: null,

      fetchAll: async () => {
        const { airports, loading } = get();
        if (airports.length > 0 || loading) return;

        set({ loading: true, error: null });

        try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Failed to fetch airport data");
          const rawJson = await response.json();

          const airportsList: Airport[] = Object.values(rawJson)
            .filter(
              (a: any) =>
                a.iata &&
                a.iata.length === 3 &&
                a.lat &&
                a.lon &&
                (a.city || a.name)
            )

            .map((a: any) => ({
              iata: a.iata,
              name: a.name,
              city: a.city || a.name,
              lat: Number(a.lat),
              lon: Number(a.lon),
            }));

          set({ airports: airportsList, loading: false });
        } catch (error: any) {
          console.error("Airport fetch failed:", error);
          set({
            error: error.message || "Unknown error",
            loading: false,
          });
        }
      },

      suggest: (query: string, limit = 10) => {
        const { airports } = get();
        if (!query.trim() || !airports.length) return [];

        const q = query.toLowerCase();
        return airports
          .filter(
            (a) =>
              a.iata.toLowerCase().startsWith(q) ||
              a.city.toLowerCase().includes(q) ||
              a.name.toLowerCase().includes(q)
          )
          .slice(0, limit);
      },
      setNearByAirports: (nearByAirportsData: Airport[]) => {
        set({ nearByAirports: nearByAirportsData });
      },

      getAiportByIata: (iata: string) => {
        const { airports } = get();
        return airports.find(
          (a) => a.iata.toLowerCase() === iata.toLowerCase()
        );
      },

      nearby: (lat: number, lon: number, radiusKm = 100) => {
        const { airports } = get();
        if (!airports.length) return [];

        return airports
          .filter((a) => distanceKm(lat, lon, a.lat, a.lon) <= radiusKm)
          .sort(
            (a, b) =>
              distanceKm(lat, lon, a.lat, a.lon) -
              distanceKm(lat, lon, b.lat, b.lon)
          );
      },
    }),
    {
      name: "airports-cache",
      version: 1,
      partialize: (state) => ({
        airports: state.airports, // only persist airports list
      }),
    }
  )
);
