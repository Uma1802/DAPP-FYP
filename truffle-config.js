const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    educertchain: {
            host: '192.168.0.105',
            port: 8501,
            network_id: '1515'
    },
    develop: {
      port: 7545
    }
  }
};
