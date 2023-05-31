const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const pkg = require('./package.json');

module.exports = function override(config) {
  config.plugins.push(
    new SWPrecacheWebpackPlugin({
      cacheId: `lesseffort-${pkg.version}`,
    }),
  );

  return config;
};
