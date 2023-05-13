export interface networkConfigItem {
    name?: string
    initBaseURI?: string
    initNotRevealedUri?: string
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
    },
    8001: {
        name: "mumbai"
    }
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6