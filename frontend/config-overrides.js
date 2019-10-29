const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    process.env.NODE_ENV === "production"
      ? new CopyWebpackPlugin([{ from: "../backend/src/types.ts" }])
      : new CopyWebpackPlugin([{ from: "../backend/src/types.ts", to: "dist" }])
  );

  return config;
};
