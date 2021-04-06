pragma solidity >=0.4.22;

contract Participants {
    mapping(address => User) usersList;
    mapping(address => User) requestsList;
    mapping(string => bool) institutionsCheckList;
    mapping(uint256 => address) usersAddrList;
    //mapping (uint => address) requestsAddrList;

    uint256 public usersCount = 0;
    uint256 public requestsCount = 0;
    uint256 private requestsArrayCount = 0;
    uint256 public institutionCount = 0;

    struct User {
        uint256 id;
        string name;
        uint256 userType; // 1 - GB, 2 - institution, 3 - edu-user
        string institution;
        address addr;
        string publicKey;
        bool exists;
    }

    //address[] usersAddrList;
    address[] requestsAddrList;
    string[] institutionsList;

    event userEvent(
        uint256 id,
        string name,
        uint256 userType,
        string institution,
        address addr
    );

    constructor() public {
        usersAddrList[usersCount] = msg.sender;
        usersList[msg.sender] = User(
            1000,
            "Governing Body",
            1,
            "None",
            msg.sender,
            "",
            true
        );
        ++usersCount;
        institutionsList.push("None");
        ++institutionCount;
        institutionsCheckList["None"] = true;
    }

    //storeDetails
    function createUserRequest(
        string memory _name,
        uint256 _userType,
        string memory _institution
    ) public {
        require(
            requestsList[msg.sender].exists == false &&
                usersList[msg.sender].exists == false,
            "User already in system or request sent"
        );
        uint256 _id = ++requestsArrayCount;
        ++requestsCount;
        requestsList[msg.sender] = User(
            _id,
            _name,
            _userType,
            _institution,
            msg.sender,
            "",
            true
        );
        requestsAddrList.push(msg.sender);
    }

    function getPendingRequest() public view returns (address[] memory) {
        return requestsAddrList;
    }

    // function getRequestAddress(uint i) view public returns(address)
    // {
    //     return requestsAddrList[i];
    // }

    function getUsersCount() public view returns (uint256) {
        return usersCount;
    }

    function getUserAddress(uint256 i) public view returns (address) {
        return usersAddrList[i];
    }

    function checkIfUserExists(address addr) public view returns (bool) {
        if (usersList[addr].exists) return true;
        return false;
    }

    function assignPublicKey(string memory pubKey) public {
        require(usersList[msg.sender].exists, "Person does not exist.");
        usersList[msg.sender].publicKey = pubKey;
    }

    function getPublicKey(address addr) public view returns (string memory) {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].publicKey);
    }

    function getParticularUsersType(address addr)
        public
        view
        returns (uint256)
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].userType);
    }

    function getParticularUsersInstitution(address addr)
        public
        view
        returns (string memory)
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].institution);
    }

    function getParticularUser(address addr)
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (
            usersList[addr].id,
            usersList[addr].name,
            usersList[addr].userType,
            usersList[addr].institution,
            usersList[addr].addr
        );
    }

    function getParticularRequest(address addr)
        public
        view
        returns (
            uint256,
            string memory,
            uint256,
            string memory,
            address
        )
    {
        require(requestsList[addr].exists, "Person does not exist.");
        return (
            requestsList[addr].id,
            requestsList[addr].name,
            requestsList[addr].userType,
            requestsList[addr].institution,
            requestsList[addr].addr
        );
    }

    function approveRequest(address addr) public {
        require(requestsList[addr].exists, "Person does not exist.");
        //require(usersList[msg.sender].userType==1 ,"Access denied");
        require(
            (usersList[msg.sender].userType == 1) ||
                (usersList[msg.sender].userType == 2 &&
                    (keccak256(
                        abi.encodePacked(requestsList[addr].institution)
                    ) ==
                        keccak256(
                            abi.encodePacked(usersList[msg.sender].institution)
                        ))),
            "Access denied"
        );

        // Generate unique id and assign to user
        User memory user = requestsList[addr];
        user.id = 1000 + ++usersCount;
        // Add user to existing users array
        usersList[addr] = user;
        usersAddrList[usersCount - 1] = addr;
        // Remove user from user request array
        delete requestsAddrList[requestsList[addr].id - 1];
        delete requestsList[addr];
        --requestsCount;
        if (usersList[addr].userType == 2) {
            if (institutionsCheckList[usersList[addr].institution] == false) {
                institutionsCheckList[usersList[addr].institution] = true;
                institutionsList.push(usersList[addr].institution);
                ++institutionCount;
            }
            emit userEvent(
                usersList[addr].id,
                usersList[addr].name,
                usersList[addr].userType,
                usersList[addr].institution,
                addr
            );
        }
    }

    function declineRequest(address addr) public {
        require(requestsList[addr].exists, "Person does not exist.");
        require(
            (usersList[msg.sender].userType == 1) ||
                (usersList[msg.sender].userType == 2 &&
                    (keccak256(
                        abi.encodePacked(requestsList[addr].institution)
                    ) ==
                        keccak256(
                            abi.encodePacked(usersList[msg.sender].institution)
                        ))),
            "Access denied"
        );
        delete requestsAddrList[requestsList[addr].id - 1];
        delete requestsList[addr];
        --requestsCount;
    }

    function getInstitution(uint256 i) public view returns (string memory) {
        require(
            institutionsCheckList[institutionsList[i]] == true,
            "Institution does not exist"
        );
        return institutionsList[i];
    }

    function getInstitutionsCount() public view returns (uint256) {
        return institutionCount;
    }

    function checkIfInstitutionExists(string memory _institution)
        public
        view
        returns (bool)
    {
        return institutionsCheckList[_institution];
    }
}
