import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import {ethers} from "hardhat"
import addDiamondCut from "../scripts/diamond-cut";
import deployContract from "../scripts/deploy";

const upgrade: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {deployments, network, getNamedAccounts} = hre
    const {deployer} = await getNamedAccounts()
    const {deploy, log} = deployments


    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    const withdrawFacet = await deployContract("WithdrawFacet", network, deploy, deployer, log, waitBlockConfirmations)

    const diamondCut = [
        [withdrawFacet.address, [ethers.utils.id('withdraw(address,uint256)')]],
    ];

    await addDiamondCut(process.env.DIAMOND_ADDRESS, diamondCut, deployer)

}

export default upgrade
upgrade.tags = ["upgrade"]