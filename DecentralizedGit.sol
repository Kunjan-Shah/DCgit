pragma solidity ^0.8.13;

contract GitRepoContract {
    // mapping(uint256 => Repo) repositories;

    Repo[] repositories;
    mapping(uint256 => mapping(address => uint256)) keys;    // find size of encrypted key
    mapping(uint256 => mapping(address => permissions)) user_permissions;
    enum permissions {
            None,
            Admin,
            Maintainer,
            Writer,
            Reader
    }
    struct Repo {
        uint256 uuid;
        string storage_address;
        uint256 integrity;  // SHA256 hash of the file, to verify if stored repo is intact
    }

    function initialize_repo(uint256 _integrity, uint256 _key, string memory _storage_address) public returns(Repo memory){
        // TODO: generate uuid here
        uint256 _uuid = repositories.length;
        Repo storage repo;
        repo.uuid = _uuid;
        repo.storage_address = _storage_address;
        repo.integrity = _integrity;
        keys[_uuid][msg.sender] = _key;
        user_permissions[_uuid][msg.sender] = permissions.Admin;

        repositories.push(repo);
        Repo memory temp = repo;
        return temp;
    }

    function grant_access(uint256 _uuid, address _address, permissions _role, uint256 _key) private {
        Repo storage repo = repositories[_uuid];

        // check if caller is Admin
        require(user_permissions[msg.sender] == permissions.Admin);

        // by default we give Writer access, TODO: change dynamically
        require(_role != permissions.Admin);
        user_permissions[_address] = _role;

        // TODO: add encrypted key to map
        keys[_uuid][_address] = _key;
    }

}