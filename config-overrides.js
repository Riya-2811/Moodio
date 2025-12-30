// Webpack configuration override to fix face-api.js Node.js module errors
module.exports = function override(config, env) {
  // Add fallbacks for Node.js core modules that face-api.js tries to use
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": false,
    "crypto": false,
    "util": false,
    "stream": false,
    "buffer": false,
    "process": false
  };

  return config;
};

