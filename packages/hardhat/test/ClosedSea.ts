import { expect } from "chai";
import { ethers } from "hardhat";
import { ClosedSea } from "../typechain-types";

describe("ClosedSea", function () {
  // We define a fixture to reuse the same setup in every test.

  let ClosedSea: ClosedSea;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const ClosedSeaFactory = await ethers.getContractFactory("ClosedSea");
    ClosedSea = (await ClosedSeaFactory.deploy(owner.address)) as ClosedSea;
    await ClosedSea.waitForDeployment();
  });

  describe("Deployment", function () {
    // Test case
  });
});
