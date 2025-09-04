import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector, {
  DetectorOptions,
} from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

const LOCAL_STORAGE_KEY = "application-language";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    supportedLngs: ["en-US", "es-ES"],
    nonExplicitSupportedLngs: false,
    debug: true,
    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    ns: ["translation", "flight_search", "faq"],
    defaultNS: "translation",

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: LOCAL_STORAGE_KEY,

      customParse: (value: string): string | undefined => {
        try {
          const parsed = JSON.parse(value);
          return parsed.language;
        } catch (e) {
          console.error("Error parsing language from localStorage:", e);
          return undefined;
        }
      },

      customStore: (lng: string): void => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ language: lng })
        );
      },
    } as Partial<DetectorOptions>,
  });

export default i18n;
