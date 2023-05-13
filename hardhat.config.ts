import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import "hardhat-contract-sizer"
import "dotenv/config"

const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: (SEPOLIA_PRIVATE_KEY !== undefined ? [SEPOLIA_PRIVATE_KEY] : []),
      saveDeployments: true,
      chainId: 11155111,
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 2,
    },
  },
};

export default config;
