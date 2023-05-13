import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import "hardhat-contract-sizer"
import "dotenv/config"
import "@nomicfoundation/hardhat-foundry";
import { execSync } from "child_process";


const PRIVATE_KEY = process.env.PRIVATE_KEY
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY || ""
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || ""

task("test", "Runs forge test", async () => {
  execSync("forge test -vvv ", { stdio: "inherit" });
});

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
      accounts: (PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []),
      saveDeployments: true,
      chainId: 11155111,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: (PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : []),
      saveDeployments: true,
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
      polygonMumbai: POLYSCAN_API_KEY
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
