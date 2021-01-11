pragma solidity >=0.4.22 <0.6.0;

contract Participants {
    mapping(address => User) usersList;
    mapping(address => User) requestsList;
    mapping(string => bool) institutionsCheckList;

    uint256 public usersCount = 0;
    uint256 public requestsCount = 0;
    uint256 private requestsArrayCount = 0;
    uint256 private usersArrayCount = 0;
    uint256 public institutionCount = 0;

    struct User {
        uint256 id;
        string name;
        uint256 userType; // 1 - AB, 2 - institution, 3 - edu-user
        string institution;
        address addr;
        bool exists;
    }

    address[] usersAddrList;
    address[] requestsAddrList;
    string[] institutionsList;

    event userRequestEvent(
        uint256 id,
        string name,
        uint256 userType,
        string institution
    );

    constructor() public {
        usersAddrList.push(msg.sender);
        usersList[msg.sender] = User(
            1000,
            "main_admin",
            1,
            "None",
            msg.sender,
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
            true
        );
        requestsAddrList.push(msg.sender);
        emit userRequestEvent(_id, _name, _userType, _institution);
    }

    function getPendingRequest() public view returns (address[] memory) {
        return requestsAddrList;
    }

    function getUsers() public view returns (address[] memory) {
        return usersAddrList;
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
        User memory user = usersList[addr];
        return (user.id, user.name, user.userType, user.institution, user.addr);
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
        User memory request = requestsList[addr];
        return (
            request.id,
            request.name,
            request.userType,
            request.institution,
            request.addr
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
        uint256 _uniqueId = 1000 + ++usersArrayCount;
        ++usersCount;
        User memory user = requestsList[addr];
        user.id = _uniqueId;
        // Add user to existing users array
        usersList[addr] = user;
        usersAddrList.push(addr);
        // Remove user from user request array
        delete requestsAddrList[requestsList[addr].id - 1];
        delete requestsList[addr];
        --requestsCount;
        if (
            usersList[addr].userType == 2 &&
            institutionsCheckList[usersList[addr].institution] == false
        ) {
            institutionsCheckList[usersList[addr].institution] = true;
            institutionsList.push(usersList[addr].institution);
            ++institutionCount;
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
}
