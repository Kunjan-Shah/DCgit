// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract GitRepoContract {
    mapping(string => Repo) public repositories;
    // The keys will be encrypted using public key of reciever
    mapping(string => mapping(address => Key)) public keys;
    mapping(string => mapping(address => Permissions)) public userPermissions;

    enum Permissions {
            None,
            Reader,
            Writer,
            Maintainer,
            Admin
    }
    struct Repo {
        string uuid;
        string storage_address;
        string integrity;  // SHA256 hash of the file, to verify if stored repo is intact
    }

    struct Key {
        string key;
        string iv;
    }

    function initializeRepo(string calldata _uuid, string calldata _storage_address, string calldata _integrity, string calldata _key, string calldata _iv) public {
        repositories[_uuid] = Repo({
            uuid: _uuid,
            storage_address: _storage_address,
            integrity: _integrity
        });

        userPermissions[_uuid][msg.sender] = Permissions.Admin;
        keys[_uuid][msg.sender] = Key({
            key: _key,
            iv: _iv
        });
    }

    function grantAccess(string calldata _uuid, address _address, Permissions _role, string calldata _key, string calldata _iv) public {
        // check if caller is Admin
        require(userPermissions[_uuid][msg.sender] == Permissions.Admin);

        require(_role != Permissions.Admin);
        userPermissions[_uuid][_address] = _role;

        keys[_uuid][_address] = Key({
            key: _key,
            iv: _iv
        });
    }

    function pushToRepo(string calldata _uuid, string calldata _storage_address, string calldata _integrity) public {
        // check if user has writer or admin permission
        require(
            userPermissions[_uuid][msg.sender] == Permissions.Admin || 
            userPermissions[_uuid][msg.sender] == Permissions.Writer
        );

        repositories[_uuid].storage_address = _storage_address;
        repositories[_uuid].integrity = _integrity;
    }
}
