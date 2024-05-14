// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LalaToken is ERC20 {
    mapping(address => uint256) public claimCount;
    mapping(address => bool) public blacklist;

    constructor() ERC20("LalaToken", "LLTK") {
        uint256 initialSupply = 10000 * (10 ** uint256(decimals()));
        _mint(address(this), initialSupply); // 将所有代币铸造到合约账户
    }

    function addToBlacklist(address _user) public {
        // 可以添加权限控制，比如只有合约拥有者可以调用
        blacklist[_user] = true;
    }

    function removeFromBlacklist(address _user) public {
        // 可以添加权限控制
        blacklist[_user] = false;
    }

    function claimTokens(address to, uint256 amount) public {
        require(!blacklist[to], "Address is blacklisted");
        require(claimCount[to] < 10, "Claim limit reached");
        require(
            balanceOf(address(this)) >= amount,
            "Not enough tokens in the contract"
        );
        _transfer(address(this), to, amount);
        claimCount[to] += 1;
    }
}
