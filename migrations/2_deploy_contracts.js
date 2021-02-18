var Participants = artifacts.require("./Participants.sol");
var Certificates = artifacts.require("./Certificates.sol");

module.exports = function(deployer) {
  deployer.deploy(Participants).then(function() {
    return deployer.deploy(Certificates, Participants.address);
  });
};

/*var Certificates = artifacts.require("./Certificates.sol");

module.exports = function(deployer) {
  deployer.deploy(Certificates, Participants.address);
};*/

