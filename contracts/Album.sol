// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Album is ERC721Enumerable, Ownable, ReentrancyGuard {
    string public albumName;
    string public albumSymbol;
    string public albumIPFSUri;
    uint256 public salePrice;
    bool private _initialized;
    IERC20 public LalaToken;

    mapping(uint256 => bool) private _isSold;
    mapping(uint256 => string) private _tokenURIs;

    // 未售出tokenId队列
    uint256[] private availableTokens;
    // 事件
    event WithdrawToken(uint256 amount, address indexed to);
    event NFTSold(uint256 indexed tokenId, uint256 price);
    event NFTMinted(uint256 indexed tokenId, uint256 price);

    constructor() ERC721("DefaultAlbum", "DALB") {
        albumName = "DefaultAlbum";
        albumSymbol = "DALB";
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _albumUri,
        uint256 _price,
        uint256 _amount,
        address _LalaToken
    ) public {
        require(!_initialized, "Album: already initialized");
        _transferOwnership(msg.sender);
        albumName = _name;
        albumSymbol = _symbol;
        albumIPFSUri = _albumUri;
        salePrice = _price;
        LalaToken = IERC20(_LalaToken);

        for (uint256 i = 1; i <= _amount; i++) {
            _mint(address(this), i);
            _setTokenURI(i, _albumUri);
            emit NFTMinted(i, salePrice); // 发出 NFTMinted 事件
        }

        // 填充未售出tokenId队列
        for (uint256 i = 1; i <= _amount; i++) {
            availableTokens.push(i);
        }

        _initialized = true;
    }

    function buyNFT() public nonReentrant {
        require(availableTokens.length > 0, "NFT is already sold out");
        uint256 tokenId = availableTokens[0]; // 取队列第一个元素

        LalaToken.transferFrom(msg.sender, address(this), salePrice); //把调用transferfrom改成transfer试试
        _isSold[tokenId] = true;
        _transfer(address(this), msg.sender, tokenId);
        emit NFTSold(tokenId, salePrice); // 发出事件
        // 移除已售出的tokenId
        removeTokenFromAvailableList(0); // 移除第一个元素
    }

    // 移除队列中的tokenId
    function removeTokenFromAvailableList(uint256 index) private {
        require(index < availableTokens.length, "Index out of bounds");
        availableTokens[index] = availableTokens[availableTokens.length - 1];
        availableTokens.pop(); // 移除最后一个元素，即原index位置的元素
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function updateAlbumURI(string memory _newUri) public onlyOwner {
        require(_initialized, "Album: not initialized");
        albumIPFSUri = _newUri; // Update the state variable first
        _setTokenURI(1, albumIPFSUri); // Then update the token URI
    }

    function getAlbumIPFSUri() public view returns (string memory) {
        return albumIPFSUri;
    }

    // 用于查询当前 NFT 的价格
    function getCurrentNFTPrice() public view returns (uint256) {
        return salePrice;
    }

    // 用于查询当前 NFT 的数量
    function getCurrentNFTAmount() public view returns (uint256) {
        return totalSupply();
    }

    // 返回当前可出售的NFT数量
    function getAvailableTokensCount() public view returns (uint256) {
        return availableTokens.length;
    }

    function getAlbumInfo()
        public
        view
        returns (
            string memory name,
            string memory symbol,
            string memory ipfsUri,
            uint256 price,
            uint256 amount
        )
    {
        return (albumName, albumSymbol, albumIPFSUri, salePrice, totalSupply());
    }

    // 用于合约拥有者提取所有 LalaToken 到自己的钱包
    function withdrawLalaTokens() public onlyOwner {
        uint256 balance = LalaToken.balanceOf(address(this));
        require(balance > 0, "Contract has no LalaToken balance");

        LalaToken.transfer(msg.sender, balance);
        emit WithdrawToken(balance, msg.sender);
    }
}
