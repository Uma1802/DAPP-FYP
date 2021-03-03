pragma solidity  >=0.4.22;

contract Participants {
    
    mapping (address => User) usersList;
    mapping (address => User) requestsList;
    mapping (string => bool) institutionsCheckList;
    
    uint public usersCount = 0;
    uint public requestsCount = 0;
    uint private requestsArrayCount = 0;
    uint private usersArrayCount = 0;
    uint public institutionCount = 0;
    
    struct User {
        uint id;
        string name;
        uint userType; // 1 - AB, 2 - institution, 3 - edu-user
        string institution;
        address addr;
        bool exists;
    }
    
    address[] usersAddrList;
    address[] requestsAddrList;
    string[] institutionsList;
    
    event userEvent
    (
        uint id,
        string name,
        uint userType,
        string institution,
        address addr
    );
    
    constructor() public
    {
        usersAddrList.push(msg.sender);
        usersList[msg.sender] = User(1000, "main_admin", 1, "None", msg.sender, true);
        ++usersCount;
        institutionsList.push("None");
        ++institutionCount;
        institutionsCheckList["None"]=true;
    }
    
    //storeDetails
    function createUserRequest(string memory _name, uint _userType, string memory _institution) public
    {
        require(requestsList[msg.sender].exists==false && usersList[msg.sender].exists==false, "User already in system or request sent");
        uint _id = ++requestsArrayCount;
        ++requestsCount;
        requestsList[msg.sender] = User(_id, _name, _userType, _institution, msg.sender, true);
        requestsAddrList.push(msg.sender);
        emit userEvent(requestsList[msg.sender].id, requestsList[msg.sender].name, requestsList[msg.sender].userType, requestsList[msg.sender].institution, msg.sender);
    }
    
    function getPendingRequest() view public returns(address[] memory)
    {
        return requestsAddrList;
    }
    
    function getUsers() view public returns(address[] memory)
    {
        return usersAddrList;
    }
    
    function checkIfUserExists(address addr) view public returns(bool)
    {
        if(usersList[addr].exists)
            return true;
        return false;
    }
    
    function getParticularUsersType(address addr) view public returns(uint)
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].userType);
    }
    
    function getParticularUsersInstitution(address addr) view public returns(string memory)
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].institution);
    }
    
    function getParticularUser(address addr) view public returns(uint, string memory, uint, string memory, address)
    {
        require(usersList[addr].exists, "Person does not exist.");
        return (usersList[addr].id, usersList[addr].name, usersList[addr].userType, usersList[addr].institution, usersList[addr].addr);
    }
    
    function getParticularRequest(address addr) view public returns(uint, string memory, uint, string memory, address)
    {
        require(requestsList[addr].exists, "Person does not exist.");
        return (requestsList[addr].id, requestsList[addr].name, requestsList[addr].userType, requestsList[addr].institution, requestsList[addr].addr);
    }
    
    function approveRequest(address addr) public{
        require(requestsList[addr].exists, "Person does not exist.");
        //require(usersList[msg.sender].userType==1 ,"Access denied");
        require((usersList[msg.sender].userType==1) || (usersList[msg.sender].userType==2 && (keccak256(abi.encodePacked(requestsList[addr].institution)) == keccak256(abi.encodePacked(usersList[msg.sender].institution)) )), "Access denied");
        
        // Generate unique id and assign to user
        uint _uniqueId = 1000 + ++usersArrayCount;
        ++usersCount;
        User memory user = requestsList[addr];
        user.id=_uniqueId;
        // Add user to existing users array
        usersList[addr] = user;
        usersAddrList.push(addr);
        // Remove user from user request array
        delete requestsAddrList[requestsList[addr].id - 1];
        delete requestsList[addr];
        --requestsCount;
        if(usersList[addr].userType == 2){
            if(institutionsCheckList[usersList[addr].institution] == false){
                institutionsCheckList[usersList[addr].institution] = true;
                institutionsList.push(usersList[addr].institution);
                ++institutionCount;
            }
            emit userEvent(usersList[addr].id, usersList[addr].name, usersList[addr].userType, usersList[addr].institution, addr);
        }
        
    }
    
    function declineRequest(address addr) public {
        require(requestsList[addr].exists, "Person does not exist.");
        require((usersList[msg.sender].userType==1) || (usersList[msg.sender].userType==2 && (keccak256(abi.encodePacked(requestsList[addr].institution)) == keccak256(abi.encodePacked(usersList[msg.sender].institution)) )), "Access denied");
        delete requestsAddrList[requestsList[addr].id - 1];
        delete requestsList[addr];
        --requestsCount;
    }
    
    function getInstitution(uint i) view public returns(string memory) {
        require(institutionsCheckList[institutionsList[i]] == true, "Institution does not exist");
        return institutionsList[i];
    }
    
    function getInstitutionsCount() view public returns(uint){
        return institutionCount;
    }
    
    function checkIfInstitutionExists(string memory _institution) view public returns(bool){
        return institutionsCheckList[_institution];
    }
    
}



