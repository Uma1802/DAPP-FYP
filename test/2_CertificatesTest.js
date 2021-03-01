const Certificates = artifacts.require("./Certificates.sol");
const Participants = artifacts.require("./Participants.sol");

contract("Certificates", async accounts => {
    
    it("deployment successful", async() => {
        let instance = await Certificates.deployed();
        let ownerAddr = await instance.owner();
        assert.equal(ownerAddr, accounts[0]);       
    });

    it("Participants contract linked", async() => {
        let instance = await Certificates.deployed();
        let participantsAddress = await instance.participants();
        let participantsInstance = await Participants.at(participantsAddress);
        let cnt = await participantsInstance.usersCount();
        assert.equal(cnt.toNumber(), 1);
    });

    it("issue certificate by institution", async() => {
        let certificateInstance = await Certificates.deployed();
        let participantsAddress = await certificateInstance.participants();
        let participantsInstance = await Participants.at(participantsAddress);
        await participantsInstance.createUserRequest("ssn_admin", 2, "ssn", { from: accounts[1] });
        await participantsInstance.createUserRequest("student_1", 3, "ssn", { from: accounts[2] });
        let cnt = await participantsInstance.requestsCount();
        assert.equal(cnt.toNumber(), 2, "participant request not creates");
        await participantsInstance.approveRequest(accounts[1], { from: accounts[0] });
        await participantsInstance.approveRequest(accounts[2], { from: accounts[1] });
        cnt = await participantsInstance.usersCount();
        assert.equal(cnt.toNumber(), 3, "users request not approved");
        await certificateInstance.createCertificate(accounts[2], "certificateHash", "ipfsHash", { from: accounts[1] });
        cnt = await certificateInstance.certificatesCount();
        assert.equal(cnt.toNumber(), 1, "certificate not issued");
    });

    it("certificate can not be issued by accreditation body", async() => {
        let certificateInstance = await Certificates.deployed();
        let participantsAddress = await certificateInstance.participants();
        let participantsInstance = await Participants.at(participantsAddress);
        let cnt = await participantsInstance.usersCount();
        assert.equal(cnt.toNumber(), 3, "users not available");
        let val = false;
        try{
            await certificateInstance.createCertificate(accounts[2], "certificateHash", "ipfsHash", { from: accounts[0] });
        } catch(e){
            val = true;
        }
        cnt = await certificateInstance.certificatesCount();
        assert.equal(val, true, "Certificate require() not working as expected");
        assert.equal(cnt.toNumber(), 1, "certificate issued");
    });

    it("certificate can not be issued by edu user", async() => {
        let certificateInstance = await Certificates.deployed();
        let participantsAddress = await certificateInstance.participants();
        let participantsInstance = await Participants.at(participantsAddress);
        let cnt = await participantsInstance.usersCount();
        assert.equal(cnt.toNumber(), 3, "users not available");
        let val = false;
        try{
        await certificateInstance.createCertificate(accounts[2], "certificateHash", "ipfsHash", { from: accounts[2] });
        } catch(e){
            val = true;
        }
        cnt = await certificateInstance.certificatesCount();
        assert.equal(val, true, "Certificate require() not working as expected");
        assert.equal(cnt.toNumber(), 1, "certificate issued");
    });

    it("certificate can be issued only to edu-user", async() => {
        let certificateInstance = await Certificates.deployed();
        let participantsAddress = await certificateInstance.participants();
        let participantsInstance = await Participants.at(participantsAddress);
        let cnt = await participantsInstance.usersCount();
        assert.equal(cnt.toNumber(), 3, "users not available");
        let val = false;
        try{
            await certificateInstance.createCertificate(accounts[0], "certificateHash", "ipfsHash", { from: accounts[1] });
        } catch(e){
            val = true;
        }
        cnt = await certificateInstance.certificatesCount();
        assert.equal(val, true, "Certificate require() not working as expected");
        assert.equal(cnt.toNumber(), 1, "certificate issued");
        try{
            await certificateInstance.createCertificate(accounts[1], "certificateHash", "ipfsHash", { from: accounts[1] });
        } catch(e){
            val = true;
        }
    });


});