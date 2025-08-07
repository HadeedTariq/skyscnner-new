import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const translationFormatter = (word: string) => {
  return word.split(" ").join("_").toLowerCase();
};

interface FormatPriceOptions {
  price: number | string;
  rateToEur: number;
}

export const formatPrice = ({ price, rateToEur }: FormatPriceOptions) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const rate =
    typeof rateToEur === "string" ? parseFloat(rateToEur) : rateToEur;

  if (isNaN(num) || isNaN(rate)) {
    console.warn("Invalid price or conversion rate provided for formatting.");
    return "€0.00";
  }

  const converted = num * rate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
};
