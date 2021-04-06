pragma solidity >=0.4.22;
import "./Participants.sol";

contract Certificates {
    Participants public participants;
    address public owner;
    mapping(uint256 => Certificate) certificatesList;
    uint256 public certificatesCount = 0;
    uint256 public totalCertificatesCount = 0;

    struct Certificate {
        uint256 id;
        address issuerAddr;
        address recipientAddr;
        string certificateHash;
        string ipfsHash;
        string encKey;
        bool exists;
    }

    event certificateCreationEvent(
        uint256 id,
        address recipientAddr,
        string certificateHash,
        string ipfsHash,
        string encKey
    );

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor(address participantsContractAddress) public {
        participants = Participants(participantsContractAddress);
        owner = msg.sender;
    }

    function changeParticipantsContractAddress(
        address newParticipantsContractAddress
    ) public onlyOwner returns (bool) {
        participants = Participants(newParticipantsContractAddress);
        return true;
    }

    function createCertificate(
        address _recipientAddr,
        string memory _certificateHash,
        string memory _ipfsHash,
        string memory _encKey
    ) public {
        require(
            participants.checkIfUserExists(_recipientAddr) == true,
            "User does not exist in the system"
        );
        require(
            participants.getParticularUsersType(msg.sender) == 2 &&
                participants.getParticularUsersType(_recipientAddr) == 3,
            "Permission denied"
        );
        ++certificatesCount;
        certificatesList[totalCertificatesCount++] = Certificate(
            totalCertificatesCount,
            msg.sender,
            _recipientAddr,
            _certificateHash,
            _ipfsHash,
            _encKey,
            true
        );
        emit certificateCreationEvent(
            totalCertificatesCount,
            _recipientAddr,
            _certificateHash,
            _ipfsHash,
            _encKey
        );
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

    function getCertificatesCount() public view returns (uint256) {
        return certificatesCount;
    }
    function getTotalCertificatesCount() public view returns (uint256) {
        return totalCertificatesCount;
    }
    function checkIfCertificateExists(uint256 _id) public view returns (bool) {
        if(certificatesList[_id].exists) return true;
        return false;
    }

    function getParticularCertificate(uint256 _id)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            address 
        )
    {
        /*require(
            certificatesList[_id].exists == true,
            "Certificate with the given ID does not exist in the system"
        );*/
        return (
            certificatesList[_id].recipientAddr,
            certificatesList[_id].certificateHash,
            certificatesList[_id].ipfsHash,
            certificatesList[_id].encKey,
            certificatesList[_id].issuerAddr
        );
    }

    function getParticularCertificateRecipientAddress(uint256 _id)
        public
        view
        returns (address)
    {
        require(
            certificatesList[_id].exists == true,
            "Certificate with the given ID does not exist in the system"
        );
        
        return (
            certificatesList[_id].recipientAddr            
        );
    }
    function getParticularCertificateIssuerAddress(uint256 _id)
        public
        view
        returns (address)
    {
        require(
            certificatesList[_id].exists == true,
            "Certificate with the given ID does not exist in the system"
        );
        
        return (
            certificatesList[_id].issuerAddr            
        );
    }
    
    function revokeCertificate(uint256 _id)
        public
    {
        require(
            certificatesList[_id].exists == true,
            "Certificate with the given ID does not exist in the system"
        );
        require(
            participants.getParticularUsersType(msg.sender) == 2,
            "Permission denied"
        );
        --certificatesCount;
        delete certificatesList[_id];
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
