export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Language configuration for menu
export const LANGUAGES = [
  { code: "pt" as const, name: "Português", flag: "🇵🇹" },
  { code: "en" as const, name: "English", flag: "🇬🇧" },
  { code: "es" as const, name: "Español", flag: "🇪🇸" },
  { code: "fr" as const, name: "Français", flag: "🇫🇷" },
  { code: "de" as const, name: "Deutsch", flag: "🇩🇪" },
  { code: "it" as const, name: "Italiano", flag: "🇮🇹" },
];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
