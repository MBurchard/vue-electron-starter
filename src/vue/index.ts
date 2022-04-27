import {configureLogging, ConsoleWrapper} from '@/common/simpleLog';
import {BackendLoggingAppender} from '@/vue/modules/backendLoggingAppender';
import {createApp} from 'vue';
import App from './App.vue';
import router from './router';

configureLogging({appender: [new ConsoleWrapper(), new BackendLoggingAppender()]});

createApp(App).use(router).mount('#app');
