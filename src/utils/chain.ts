import { SEPOLIA_OPT_HEX, OPTIMISM_OPT_HEX } from "../constants/chainId";
const CHAIN_NOT_FOUND = "4902"

export interface Chain {
  chainId: string, // Replace with the correct chainId for Sepolia
  chainName: string,
  nativeCurrency: {
    name: string,
    symbol: string,
    decimals: number
  },
  rpcUrls: string[],
  blockExplorerUrls: string[]
}

export const CHAIN_DETAILS: { [key: string]: Chain } = {
  [SEPOLIA_OPT_HEX]: {
    chainId: SEPOLIA_OPT_HEX,
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  [OPTIMISM_OPT_HEX]: {
    chainId: OPTIMISM_OPT_HEX,
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io']
  }
}

export const getNetworkName = (networkId: string) => {
  switch (networkId) {
      case '1':
      case '0x1':
          return 'Ethereum'; // Ethereum Mainnet
      case '10':
      case 'a':
      case '0xa':
          return 'Optimism'; // Optimism
      case '42161':
          return 'Arbitrum'; // Arbitrum One
      case '11155111':
      case 'aa36a7':
      case '0xaa36a7':
          return 'Sepolia'; // Sepolia Testnet
      default:
          return 'Unknown';
  }
};

export const setChain = async (chainId: string) => {
  const networkId = '0x' + (await (window.ethereum as any)?.request({ method: 'net_version' }).catch(() => '1')).replace(/^0x/, '')

  if (!CHAIN_DETAILS[chainId]) {
    console.error(`Invalid chain ID: ${chainId}`)
    return
  }

  if (chainId !== networkId) {
    try {
      await (window.ethereum as any)?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }]
      });
    } catch (err) {
      if (String(err).includes(CHAIN_NOT_FOUND)) {
        await (window.ethereum as any)?.request({
          method: 'wallet_addEthereumChain',
          params: [CHAIN_DETAILS[chainId]]
        })
      } else {
        throw new Error(`User cancelled connection to ${chainId}`)
      }
    }
  }
}
