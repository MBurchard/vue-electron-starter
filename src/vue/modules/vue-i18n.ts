import {i18n} from '@/common/i18n.config';
import {LogLevel, useLogger} from '@/common/simpleLog';
import {registerBackendListener, sendToBackend} from '@/vue/modules/backendBridge';
import {ref} from 'vue';

const log = useLogger('vue-i18n', LogLevel.DEBUG);

const locale = ref<string>('en');

i18n.on('languageChanged', (lng) => {
  log.debug('i18n languageChanged:', lng);
  locale.value = lng;
});

registerBackendListener('languageChanged', (event, lng: string) => {
  i18n.changeLanguage(lng).then(() => {
    log.debug('langauge changed from backend');
  });
});

/**
 * looks a little hacky, but checking the reactive locale is the way to trigger a refresh when the locale changes.
 *
 * @param key
 */
function t(key: string): string | undefined {
  log.debug('get translation for key', key);
  if (locale.value) {
    return i18n.t(key);
  }
}

export function useI18n(): {
  changeLanguage: (lng: string) => void
  getLanguage: () => string
  t: (key: string) => string | undefined
  } {
  return {
    changeLanguage: (lng: string) => {
      i18n.changeLanguage(lng).then();
      sendToBackend('languageChanged', lng);
    },
    getLanguage: () => {
      return i18n.language;
    },
    t,
  };
}
