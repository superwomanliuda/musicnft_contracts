// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Album.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlbumFactory is Ownable {
    address public albumImplementation;
    address[] public deployedAlbums;
    address private lastClonedAlbum;
    address public LalaToken; // 添加平台代币的地址

    event AlbumCreated(
        address indexed album,
        address indexed owner,
        string albumIPFSUri
    );

    // 修改构造函数以包含平台代币的地址
    constructor(address _initialAlbum, address _LalaToken) Ownable() {
        albumImplementation = _initialAlbum;
        LalaToken = _LalaToken; // 设置平台代币的地址
        _transferOwnership(msg.sender);
    }

    // 修改了函数签名以包含专辑的 IPFS URI、价格和数量
    function cloneAndInitializeAlbum(
        string memory _name,
        string memory _symbol,
        string memory _albumUri,
        uint256 _price,
        uint256 _amount
    ) external returns (address) {
        address clonedAlbum = Clones.clone(albumImplementation);
        deployedAlbums.push(clonedAlbum);
        lastClonedAlbum = clonedAlbum;

        // 调用修改后的初始化函数
        Album(clonedAlbum).initialize(
            _name,
            _symbol,
            _albumUri,
            _price,
            _amount,
            LalaToken
        );
        Album(clonedAlbum).transferOwnership(msg.sender);

        emit AlbumCreated(clonedAlbum, msg.sender, _albumUri);
        return clonedAlbum;
    }

    function getLastClonedAlbum() external view returns (address) {
        return lastClonedAlbum;
    }

    function getDeployedAlbums() external view returns (address[] memory) {
        return deployedAlbums;
    }

    function upgradeAlbumImplementation(
        address _newAlbumImplementation
    ) external onlyOwner {
        require(
            Ownable(_newAlbumImplementation).owner() == address(this),
            "Invalid owner"
        );
        albumImplementation = _newAlbumImplementation;
    }
}
