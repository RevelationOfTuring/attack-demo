const hre = require("hardhat");
const {expect} = require("chai");

async function main() {
    const signers = await ethers.getSigners();
    const hacker = signers[1];
    console.log(`hacker address: ${hacker.address} with balance ${(await ethers.provider.getBalance(hacker.address)).toString()}`);

    const Victim = await hre.ethers.getContractFactory("Victim_1", signers[0]);
    const Attacker = await hre.ethers.getContractFactory("Attacker_1", hacker);
    const victim = await Victim.deploy({value: ethers.utils.parseEther('10')});
    await victim.deployed();
    console.log(`Victim contract deployed to ${victim.address} with balance ${(await ethers.provider.getBalance(victim.address)).toString()}`);

    const attacker = await Attacker.deploy(victim.address);
    await attacker.deployed();
    console.log(`Attacker contract deployed to ${attacker.address} with balance ${(await ethers.provider.getBalance(attacker.address)).toString()}`);

    // attack
    console.log('attacking...');
    await attacker.attack({value: ethers.utils.parseEther('1')});
    expect(await ethers.provider.getBalance(victim.address)).to.be.equal(0);
    const attackerBalance = await ethers.provider.getBalance(attacker.address);
    console.log('balance of attacker contract: ', attackerBalance.toString());

    // withdraw money from attacker contract
    console.log('withdraw from attacker contract...');
    await attacker.connect(hacker).withdraw();
    expect(await ethers.provider.getBalance(attacker.address)).to.be.equal(0);
    console.log('balance of hacker: ', (await ethers.provider.getBalance(hacker.address)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
