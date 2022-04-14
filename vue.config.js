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
    },
  },
  transpileDependencies: true,
});
