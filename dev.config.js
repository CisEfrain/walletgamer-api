module.exports = {
    apps : [{
      name: "api-wallet-dev",
      script: "./server.js",
      env: {
        NODE_ENV: "development",
      }
    }]
  }