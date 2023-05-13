import { ethers } from "hardhat";
import { DiamondCutFacet } from "../typechain-types"


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

    // Prepare the diamondCut array
    // const diamondCut = cuts.map(([facetAddress, functionSignatures]) => [
    //     facetAddress,
    //     functionSignatures.map((signature) => ethers.utils.id(signature)),
    //     ethers.utils.defaultAbiCoder.encode(['uint8[]'], [[0]]) // the 'action' parameter for each function - 0 means adding a new function
    // ]);

    // Call diamondCut
    const tx = await diamond.diamondCut(createDiamondCut(cuts), ethers.constants.AddressZero, "0x");
    await tx.wait();
}


async function addDiamondCut(diamondAddress, diamondCut, deployer) {
    const signer = await ethers.getSigner(deployer);;
    console.log(signer.address)
    await createCuts(diamondAddress, diamondCut, signer);
}

export default addDiamondCut
