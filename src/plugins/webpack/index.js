module.exports = function (context, options) {
  return {
    name: "dev-webpack-configure",
    configureWebpack(config, isServer, utils) {
      console.info("Custom Webpack configuration loaded.");

      return {
        devServer: {
          headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
          },
        },
      };
    },
  };
};