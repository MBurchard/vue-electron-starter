<script lang="ts" setup>
import HelloWorld from '@/vue/components/HelloWorld.vue';
import {getFromBackend} from '@/vue/modules/backendBridge';

getFromBackend('testChannel', 'HomeView').then(result => {
  console.log('test', result);
}).catch(reason => {
  console.error('Error getting data from Electron', reason);
});

</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>
