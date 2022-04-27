<script lang="ts" setup>
import {useLogger} from '@/common/simpleLog';
import HelloWorld from '@/vue/components/HelloWorld.vue';
import {getFromBackend} from '@/vue/modules/backendBridge';

const log = useLogger('HomeView');

getFromBackend('testChannel', 'HomeView').then(result => {
  log.debug('Test', result);
  log.info('Test', result);
  log.warn('Test', result);
  log.error('Test', result);
}).catch(reason => {
  log.error('Error getting data from Electron', reason);
});

</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>
