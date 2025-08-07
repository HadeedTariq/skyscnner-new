import axios from "axios";

export const getConversionRateToEUR = async (
  fromCurrency: string
): Promise<number> => {
  if (!fromCurrency || fromCurrency === "EUR") return 1;

  try {
    const res = await axios.get(`https://api.frankfurter.app/latest`, {
      params: { from: fromCurrency, to: "EUR" },
      timeout: 3000,
    });

    const rate = res?.data?.rates?.EUR;

    if (typeof rate === "number" && rate > 0) {
      return rate;
    } else {
      console.warn(
        `Received invalid rate from API for currency: ${fromCurrency}`
      );
      return 1; // fallback to 1 if rate is invalid
    }
  } catch (err: any) {
    console.error(`Currency conversion failed from ${fromCurrency} to EUR.`, {
      message: err?.message || err,
    });
    return 1; // fallback to 1 on failure
  }
};
