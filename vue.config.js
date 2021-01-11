const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        _: "lodash",
        moment: "moment"
      })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    autoRouting: {
      chunkNamePrefix: "page-"
    }
  }
};
