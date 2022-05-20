// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract MetaToken is ERC20, ERC2771Context, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 amount_,
        address trustedForwarder_
    ) ERC20(name_, symbol_) ERC2771Context(trustedForwarder_) {
        _mint(msg.sender, amount_);
    }

    function mint(address user, uint256 amount) external onlyOwner {
        _mint(user, amount);
    }

    function _msgSender()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (address)
    {
        ERC2771Context._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(Context, ERC2771Context)
        returns (bytes memory)
    {
        ERC2771Context._msgData();
    }
}
