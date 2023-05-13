import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import {
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../helper-hardhat-config"
import {ethers} from "hardhat"
import addDiamondCut from "../scripts/diamond-cut";
import deployContract from "../scripts/deploy";


const deployDiamond: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {deployments, network, getNamedAccounts} = hre
    const {deployer} = await getNamedAccounts()
    const {deploy, log} = deployments


    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS


    const diamondCutFacet = await deployContract("DiamondCutFacet", network, deploy, deployer, log, waitBlockConfirmations)
    const diamondLoupeFacet = await deployContract("DiamondLoupeFacet", network, deploy, deployer, log, waitBlockConfirmations)
    const ownershipFacet = await deployContract("OwnershipFacet", network, deploy, deployer, log, waitBlockConfirmations)
    const depositFacet = await deployContract("DepositFacet", network, deploy, deployer, log, waitBlockConfirmations)
    const diamond = await deployContract("Diamond", network, deploy, deployer, log, waitBlockConfirmations, [deployer, diamondCutFacet.address])

    const diamondCut = [
        [diamondCutFacet.address, [ethers.utils.id('diamondCut((address,uint256[],bytes)[])')]],
        [diamondLoupeFacet.address, [ethers.utils.id('facetAddress(bytes4)'), ethers.utils.id('facets()'), ethers.utils.id('facetFunctionSelectors(address)'), ethers.utils.id('facetAddresses()')]],
        [ownershipFacet.address, [ethers.utils.id('owner()'), ethers.utils.id('transferOwnership(address)')]],
        [depositFacet.address, [ethers.utils.id('depositNative()'), ethers.utils.id('depositERC20(address,uint256)'), ethers.utils.id('balances(address,address)')]],
    ];

    await addDiamondCut(diamond.address, diamondCut, deployer)

}

export default deployDiamond
deployDiamond.tags = ["all", "diamond"]