import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { Contract } from "ethers";

/**
 * Deploys a contract named "ClosedSea" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployClosedSea: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ClosedSea", {
    from: deployer,
    // Contract constructor arguments
    args: ["0x2BF1afE86EF6ED9c1278CdC6EAE091a2760D00B5"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  // const ClosedSea = await hre.ethers.getContract<Contract>("ClosedSea", deployer);
  // console.log("Is deployer a user?", await ClosedSea.isUser(deployer));
};

export default deployClosedSea;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags ClosedSea
deployClosedSea.tags = ["ClosedSea"];
