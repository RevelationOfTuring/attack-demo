//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
// 0.7/0.8 cannot be able to attack by this case¬

contract Victim_1 {
    mapping(address => uint) public balances;

    constructor() public payable{}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint amount) external {
        address sender = msg.sender;
        uint balance = balances[sender];
        require(balance >= amount, "0 balance");
        (bool success,) = sender.call{value : amount}("");
        require(success, "fail to transfer");
        balances[sender] -= amount;
    }

    // helper
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}