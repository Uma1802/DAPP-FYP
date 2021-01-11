var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};

var Participants = artifacts.require("./Participants.sol");

module.exports = function(deployer) {
  deployer.deploy(Participants);
};
