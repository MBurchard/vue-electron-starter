const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
  pages: {
    index: {
      entry: 'src/vue',
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/electron',
      preload: 'src/electron/preload.ts',
    },
  },
  transpileDependencies: true,
});
