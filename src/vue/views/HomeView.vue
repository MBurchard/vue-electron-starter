<script lang="ts" setup>
import {LogLevel, useLogger} from '@/common/simpleLog';
import HelloWorld from '@/vue/components/HelloWorld.vue';
import {getFromBackend} from '@/vue/modules/backendBridge';
import {useI18n} from '@/vue/modules/vue-i18n';

const log = useLogger('HomeView', LogLevel.DEBUG);

getFromBackend('testChannel', 'HomeView').then(result => {
  log.debug('Test', result);
  log.info('Test', result);
  log.warn('Test', result);
  log.error('Test', result);
  const img = document.querySelector('img');
  const element = document.querySelector('div.home');
  log.info('html element img test', img);
  log.info('html element test', element);
  log.info('function test', useLogger);
  log.info('object test', {key1: 100, key2: true, key3: undefined, key4: {a: '', b: 'nix'}, arr1: [1, 2, 3, {a: 1, b: 2}, new Date()]});
}).catch(reason => {
  log.error('Error getting data from Electron', reason);
});

const {changeLanguage, getLanguage, t} = useI18n();

function toggleLang() {
  if (getLanguage() === 'en') {
    changeLanguage('de');
  } else {
    changeLanguage('en');
  }
}

</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png" @click="toggleLang">
    <HelloWorld :msg="t('HelloWorldMessage')"/>
  </div>
</template>
