import config_app from "@/config/app.json";

const plugins = config_app.plugins;

export default store => {
  plugins.forEach(plugin => {
    const pluginFile = require(`@/plugins/${plugin}`);
    if (typeof pluginFile === "object" && _.has(pluginFile, "default")) {
      pluginFile.default({ store });
    }
  });
};
