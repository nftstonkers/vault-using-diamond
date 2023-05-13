import {ethers} from "hardhat";
import {DiamondCutFacet} from "../typechain-types"


const createDiamondCut = (cut: [string, string[]][]) => {
    return cut.map(([address, functionId]) => [
        address,
        0,
        functionId.map(id => ethers.utils.hexDataSlice(id, 0, 4)),
    ]);
};


async function createCuts(diamondAddress: string, cuts: [string, string[]][], signer: ethers.Signer) {
    // Get a fully typed contract instance
    const diamond = (await ethers.getContractAt("DiamondCutFacet", diamondAddress, signer)) as DiamondCutFacet;

    // Call diamondCut
    const tx = await diamond.diamondCut(createDiamondCut(cuts), ethers.constants.AddressZero, "0x");
    await tx.wait();
}


async function addDiamondCut(diamondAddress, diamondCut, deployer) {
    const signer = await ethers.getSigner(deployer);
    ;
    console.log(signer.address)
    await createCuts(diamondAddress, diamondCut, signer);
}

export default addDiamondCut
