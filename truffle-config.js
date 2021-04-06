const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    educertchain: {
            host: '192.168.0.104',
            port: 8501,
            network_id: '1515'
    },
    // ecchain: {
    //         host: '127.0.0.1',
    //         port: 7545,
    //         network_id: '5777'
    // },
    develop: {
      port: 7545
    }
  }
};
