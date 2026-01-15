/**
 * @file i18n configuration
 * @description Internationalization setup with react-i18next
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// DONE(B): Import all translation files - TASK-013
// English
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enHistory from './locales/en/history.json';

// Chinese
import zhCommon from './locales/zh/common.json';
import zhAuth from './locales/zh/auth.json';
import zhDashboard from './locales/zh/dashboard.json';
import zhSettings from './locales/zh/settings.json';
import zhHistory from './locales/zh/history.json';

// Japanese
import jaCommon from './locales/ja/common.json';
import jaAuth from './locales/ja/auth.json';
import jaDashboard from './locales/ja/dashboard.json';
import jaSettings from './locales/ja/settings.json';
import jaHistory from './locales/ja/history.json';

// DONE(B): Define resources object with all namespaces - TASK-013
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    settings: enSettings,
    history: enHistory,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    dashboard: zhDashboard,
    settings: zhSettings,
    history: zhHistory,
  },
  ja: {
    common: jaCommon,
    auth: jaAuth,
    dashboard: jaDashboard,
    settings: jaSettings,
    history: jaHistory,
  },
};

// DONE(B): Configure i18n - TASK-013
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'settings', 'history'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
