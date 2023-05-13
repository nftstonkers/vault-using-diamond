import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import verify from "../utils/verify"
import { ethers } from "hardhat"
import addDiamondCut from "../scripts/diamond-cut";

const deployContract = async (
    name,
    network,
    deploy,
    deployer,
    log,
    waitBlockConfirmations,
    args: any[] = []
) => {

  const contract = await deploy(name, {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: waitBlockConfirmations,
  })

  if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...")
    await verify(contract.address, args)
  }

  return contract
}
const upgrade: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
  const { deployments, network, getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments


  const waitBlockConfirmations = developmentChains.includes(network.name)
      ? 1
      : VERIFICATION_BLOCK_CONFIRMATIONS

  if (developmentChains.includes(network.name)) {
    // Write code Specific to Local Network Testing
  }


  const diamondVaultFacetV2 = await deployContract("DiamondVaultFacetV2",network,deploy,deployer,log,waitBlockConfirmations)

  const diamondCut = [
    [diamondVaultFacetV2.address, [ethers.utils.id('withdraw(address,uint256)')]],
  ];

  console.log(deployer)
  await addDiamondCut(process.env.DIAMOND_ADDRESS,diamondCut, deployer)

}

export default upgrade
upgrade.tags = ["upgrade"]