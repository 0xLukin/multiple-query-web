import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ja from "./locales/ja.json";

export const languageList = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "日本語",
    code: "ja",
  },
];

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
