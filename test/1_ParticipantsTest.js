const Participants = artifacts.require("./Participants.sol");
// const Certificates = artifacts.require("./Certificates.sol");

contract("Participants", accounts => {
    var participantInstance;
    
    it("initialize with one participant on deployment", function() {
        return Participants.deployed().then(function(instance) {
            return instance.usersCount();
        }).then(function(count) {
            assert.equal(count, 1, "Not intialized on deployment");
        });
    });  

    it("it initializes the partipant with the correct values", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            return participantInstance.getParticularUser(accounts[0]);
        }).then(function(participant) {
            assert.equal(participant[0], 1000, "contains the correct id?");
            assert.equal(participant[1], "main_admin", "contains the correct name?");
            assert.equal(participant[2], 1, "contains the correct userType?");
            assert.equal(participant[3], "None", "contains the correct institution?");
            assert.equal(participant[4], accounts[0], "contains the correct address?");
        });
    });

    it("creates a new request", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.createUserRequest("ssn_admin", 2, "ssn", { from: accounts[1] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "New user request not created");
        });
    });

    it("does not create a new request for existing user", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            return participantInstance.createUserRequest("ssn_admin", 2, "ssn", { from: accounts[0] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "User request created");// count is 1 because already sent a request in a test case
        });
    });

    it("does not create a new request if already requested", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            return participantInstance.createUserRequest("ssn_admin", 2, "ssn", { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "User request created");// count is 1 because already sent a request in a test case
        });
    });

    it("approve institution request by accreditation body", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.approveRequest(accounts[1], { from: accounts[0] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 0, "New user request not created");
            return participantInstance.usersCount();
        }).then(function(count) {
            assert.equal(count, 2, "New user not added");
        });
    });

    it("approve request by institution", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.createUserRequest("student_1", 3, "ssn", { from: accounts[2] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "New user request not created");
            participantInstance.approveRequest(accounts[2], { from: accounts[1] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 0, "Request not deleted");
            return participantInstance.usersCount();
        }).then(function(count) {
            assert.equal(count, 3, "New user not added");
        });
    });

    it("institution can not approve request if request not from that institution", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.createUserRequest("student", 3, "None", { from: accounts[3] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "New user request not created");
            return participantInstance.approveRequest(accounts[3], { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "User request approved");
        });
    });

    it("decline request by accreditation body", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.declineRequest(accounts[3], { from: accounts[0] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 0, "New user request not created");
        });
    });

    it("decline request by institution", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.createUserRequest("student_2", 3, "ssn", { from: accounts[3] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "New user request not created");
            participantInstance.declineRequest(accounts[3], { from: accounts[1] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 0, "User request not declined");
        });
    });

    it("institution can not decline request if requesting user is from another institution", function() {
        return Participants.deployed().then(function(instance) {
            participantInstance = instance;
            participantInstance.createUserRequest("student", 3, "None", { from: accounts[3] });
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "New user request not created");
            return participantInstance.declineRequest(accounts[3], { from: accounts[1] });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return participantInstance.requestsCount();
        }).then(function(count) {
            assert.equal(count, 1, "User request was declined");
        });
    });

    // it("institution can not decline request if requesting user is from another institution", function() {
    //     let certificateInstance = Certificates.deployed();
    //     participantInstance = Participants.deployed();
    //     certificateInstance.createCertificate(accounts[2], "hash", "hash",{ from: accounts[1] })
    //     .then(function(certificate) {
    //         assert.equal(certificate.logs.length, 1, "event triggered?");
    //         assert.equal(certificate.logs[0].event, "certificateCreationEvent", "certificate created?"); 
    //         assert.equal(certificate.logs[0].args._recipientAddr, accounts[2], "the candidate id is correct?");
    //         return certificateInstance.certificatesList(1);
    //     }).then(function(certificate) {
    //         assert(certificate[4], "the certificate is available in the list");
    //         return certificateInstance.certificatesCount();
    //     }).then(function(count) {
    //         assert.equal(count, 1, "certificate count not incremented");
    //     });
    // });
        
});