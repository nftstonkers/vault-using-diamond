import {developmentChains} from "../helper-hardhat-config";
import verify from "./verify";
import addDiamondCut from "./diamond-cut";

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
        !developmentChains.includes(network.name)
    ) {
        log("Verifying...")
        await verify(contract.address, args)
    }

    return contract
}

export default deployContract
