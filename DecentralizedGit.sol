pragma solidity ^0.8.13;

contract GitRepoContract {
    Repo[] private repositories;
    // The keys will be encrypted using public key of reciever
    mapping(uint256 => mapping(address => uint256)) public keys;    // TODO: find size of encrypted key
    mapping(uint256 => mapping(address => permissions)) public user_permissions;

    enum permissions {
            None,
            Reader,
            Writer,
            Maintainer,
            Admin
    }
    struct Repo {
        uint256 uuid;
        string storage_address;
        bytes32 integrity;  // SHA256 hash of the file, to verify if stored repo is intact
    }

    function initialize_repo(string memory _storage_address, bytes32 _integrity, uint256 _key) public returns (uint256 uuid){
        uint256 _uuid = repositories.length;
        repositories.push(Repo({
            uuid: _uuid,
            storage_address: _storage_address,
            integrity: _integrity
        }));

        user_permissions[_uuid][msg.sender] = permissions.Admin;
        keys[_uuid][msg.sender] = _key;

        return uuid;
    }

    function grant_access(uint256 _uuid, address _address, permissions _role, uint256 _key) public {
        // check if caller is Admin
        require(user_permissions[_uuid][msg.sender] == permissions.Admin);

        require(_role != permissions.Admin);
        user_permissions[_uuid][_address] = _role;

        keys[_uuid][_address] = _key;
    }

    function push_to_repo(uint256 _uuid, string memory _storage_address, bytes32 _integrity) public {
        // check if user has writer or admin permission
        require(user_permissions[_uuid][msg.sender] == permissions.Admin || user_permissions[_uuid][msg.sender] == permissions.Writer);

        repositories[_uuid].storage_address = _storage_address;
        repositories[_uuid].integrity = _integrity;
    }
}