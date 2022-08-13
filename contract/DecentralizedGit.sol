// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13.0;

contract DCGit {
    mapping(string => Repo) public repositories;
    mapping(string => mapping(address => Key)) public keys; // keys[repo id][address]=key
    mapping(string => mapping(address => Permissions)) public userPermissions; // userPermissions[repo id][address]=Permission

    enum Permissions {
            None,
            Reader,
            Writer,
            Maintainer,
            Admin
    }

    struct Repo {
        string uuid;
        string storageAddress;
        string integrity;  // SHA256 hash of the file, to verify if stored repo is intact
    }

    struct Key {
        string key;
        string iv;
    }

    function init(string calldata _uuid, string calldata _storageAddress, string calldata _integrity, string calldata _key, string calldata _iv) public {
        require(bytes(repositories[_uuid].uuid).length == 0);

        repositories[_uuid] = Repo({
            uuid: _uuid,
            storageAddress: _storageAddress,
            integrity: _integrity
        });
        userPermissions[_uuid][msg.sender] = Permissions.Admin;
        keys[_uuid][msg.sender] = Key({
            key: _key,
            iv: _iv
        });
    }

    function permit(string calldata _uuid, address _address, Permissions _role, string calldata _key, string calldata _iv) public {
        require(userPermissions[_uuid][msg.sender] == Permissions.Admin);
        require(_role != Permissions.Admin);

        userPermissions[_uuid][_address] = _role;

        keys[_uuid][_address] = Key({
            key: _key,
            iv: _iv
        });
    }

    function push(string calldata _uuid, string calldata _storageAddress, string calldata _integrity) public {
        require(
            userPermissions[_uuid][msg.sender] == Permissions.Admin || 
            userPermissions[_uuid][msg.sender] == Permissions.Writer
        );

        repositories[_uuid].storageAddress = _storageAddress;
        repositories[_uuid].integrity = _integrity;
    }
}
