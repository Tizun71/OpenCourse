const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyContract", function () {
  let MyContract;
  let myContract;
  let owner;

  beforeEach(async function () {
    MyContract = await ethers.getContractFactory("MyContract");
    [owner] = await ethers.getSigners();
    myContract = await MyContract.deploy("Initial Name", 42);
  });

  it("should deploy with the correct initial values", async function () {
    expect(await myContract.name()).to.equal("Initial Name");
    expect(await myContract.number()).to.equal(42);
  });

  it("should allow the owner to change the name", async function () {
    await myContract.setName("New Name");
    expect(await myContract.name()).to.equal("New Name");
  });

  it("should allow the owner to change the number", async function () {
    await myContract.setNumber(100);
    expect(await myContract.number()).to.equal(100);
  });
});
