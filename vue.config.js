const {defineConfig} = require('@vue/cli-service');
module.exports = defineConfig({
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/electron',
    },
  },
  transpileDependencies: true,
});
