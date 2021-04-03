const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    certchain: {
            host: '192.168.1.4',
            port: 8501,
            network_id: '1515'
    },
    develop: {
      port: 7545
    }
  }
};
