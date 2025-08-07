"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversionRateToEUR = void 0;
const axios_1 = __importDefault(require("axios"));
const getConversionRateToEUR = async (fromCurrency) => {
    if (!fromCurrency || fromCurrency === "EUR")
        return 1;
    try {
        const res = await axios_1.default.get(`https://api.frankfurter.app/latest`, {
            params: { from: fromCurrency, to: "EUR" },
            timeout: 3000,
        });
        const rate = res?.data?.rates?.EUR;
        if (typeof rate === "number" && rate > 0) {
            return rate;
        }
        else {
            console.warn(`Received invalid rate from API for currency: ${fromCurrency}`);
            return 1; // fallback to 1 if rate is invalid
        }
    }
    catch (err) {
        console.error(`Currency conversion failed from ${fromCurrency} to EUR.`, {
            message: err?.message || err,
        });
        return 1; // fallback to 1 on failure
    }
};
exports.getConversionRateToEUR = getConversionRateToEUR;
//# sourceMappingURL=general.utils.js.map