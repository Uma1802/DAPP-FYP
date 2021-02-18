pragma solidity  >=0.4.22;
import "./Participants.sol";

contract Certificates {
    
    Participants participants;
    address public owner;
    mapping (uint => Certificate) certificatesList;
    uint public certificatesCount = 0;
    
    struct Certificate {
        uint id;
        address recipientAddr;
        string certificateHash;
        string ipfsHash;
        bool exists;
    }
    
    event certificateCreationEvent
    (
        uint id,
        address recipientAddr,
        string certificateHash,
        string ipfsHash
    );
    
    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }
    
    constructor(address participantsContractAddress) public {
        participants = Participants(participantsContractAddress);
        owner = msg.sender;
    }
    
    function changeParticipantsContractAddress(address newParticipantsContractAddress) public onlyOwner returns(bool) {
      participants = Participants(newParticipantsContractAddress);
      return true;
    }
    
    function createCertificate(address _recipientAddr, string memory _certificateHash, string memory _ipfsHash) public
    {
        require(participants.checkIfUserExists(_recipientAddr)==true , "User does not exist in the system");
        require(participants.getParticularUsersType(msg.sender)==2, "Permission denied");
        certificatesList[certificatesCount++] = Certificate(certificatesCount,_recipientAddr, _certificateHash, _ipfsHash,true);
        emit certificateCreationEvent(certificatesCount,_recipientAddr, _certificateHash, _ipfsHash);
    }
    
    
    // function getUserCertificates() public returns(uint, uint[] memory) {
    //     require(participants.checkIfUserExists(msg.sender)==true, "User does not exist in the system");
    //     uint[] memory certificatesId;
    //     uint cnt=0;
    //     for(uint i=0; i<certificatesCount; i++){
    //         a = certificatesList[i].recipientAddr;
    //         if(certificatesList[i].recipientAddr == msg.sender){
                
    //             ++c;
    //             certificatesId[cnt++]=certificatesList[i].id;
    //         }
    //     }
    //     return (cnt, certificatesId);
    // }
    
    function getCertificateCount() view public returns(uint){
        return certificatesCount;
    }
    
    function getParticularCertificate(uint _id) view public returns(address, string memory, string memory) {
        require(certificatesList[_id].exists==true, "Certificate with the given ID does not exist in the system");
        return (certificatesList[_id].recipientAddr, certificatesList[_id].certificateHash, certificatesList[_id].ipfsHash);
    }
    
    function getParticularCertificateHash(uint _id) view public returns(address, string memory) {
        require(certificatesList[_id].exists==true, "Certificate with the given ID does not exist in the system");
        return (certificatesList[_id].recipientAddr, certificatesList[_id].certificateHash);
    }
    
    // function getParticularInstitutionCertificates(string memory _institution) view public returns(uint[] memory) {
    //     require(participants.checkIfInstitutionExists(_institution)==true, "Given institution does not exist in the system");uint[] memory certificatesId;
    //     uint cnt=0;
    //     uint[] memory certificatesId;
    //     for(uint i=0; i<certificatesCount; i++){
    //         if(keccak256(abi.encodePacked(participants.getParticularUsersInstitution(certificatesList[i].recipientAddr)))
    //         == keccak256(abi.encodePacked(_institution))){
    //             certificatesId[cnt++]=certificatesList[i].id;
    //         }
    //     }
    //     return certificatesId;
    // }
}
    
