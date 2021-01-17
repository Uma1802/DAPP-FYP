var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};

var Participants = artifacts.require("./Participants.sol");

module.exports = function(deployer) {
  deployer.deploy(Participants);
};

var Certificates = artifacts.require("./Certificates.sol");

module.exports = function(deployer) {
  deployer.deploy(Certificates, Participants.address);
};