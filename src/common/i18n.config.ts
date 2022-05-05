import {LogLevel, useLogger} from '@/common/simpleLog';
import i18next, {InitOptions} from 'i18next';
import de from '@/locales/de.json';
import en from '@/locales/en.json';

const log = useLogger('i18n-config', LogLevel.DEBUG);

const options: InitOptions = {
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common'],
  supportedLngs: ['de', 'en'],
  saveMissing: true,
  resources: {
    de: {
      common: de,
    },
    en: {
      common: en,
    },
  },
};

if (!i18next.isInitialized) {
  i18next.init(options).then(() => {
    console.log('i18n initialized');
  });
}

export const i18n = i18next;

i18n.on('missingKey', (lng, ns, key, fallback) => {
  log.debug(`Missing i18n key value pair for language: ${lng}, namespace: ${ns}, key: ${key}, fallback: ${fallback}`);
});
