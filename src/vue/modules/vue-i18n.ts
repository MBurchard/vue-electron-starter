import {i18n} from '@/common/i18n.config';
import {LogLevel, useLogger} from '@/common/simpleLog';
import {Callback, TFunction} from 'i18next';
import {ref} from 'vue';

const log = useLogger('vue-i18n', LogLevel.DEBUG);

const locale = ref<string>('en');

i18n.on('languageChanged', (lng) => {
  log.debug('i18n languageChanged:', lng);
  locale.value = lng;
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
  changeLanguage: (lng?: string, callback?: Callback) => Promise<TFunction>
  getLanguage: () => string
  t: (key: string) => string | undefined
  } {
  return {
    changeLanguage: i18n.changeLanguage,
    getLanguage: () => {
      return i18n.language;
    },
    t,
  };
}
