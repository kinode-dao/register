import { SEPOLIA_OPT_HEX, OPTIMISM_OPT_HEX } from "../constants/chainId";

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
    chainId: SEPOLIA_OPT_HEX, // Replace with the correct chainId for Sepolia
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia-infura.brave.com/'], // Replace with Sepolia's RPC URL
    blockExplorerUrls: ['https://sepolia.etherscan.io'] // Replace with Sepolia's block explorer URL
  },
  [OPTIMISM_OPT_HEX]: {
    chainId: OPTIMISM_OPT_HEX, // Replace with the correct chainId for Sepolia
    chainName: 'Optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet-optimism.brave.com/'], // Replace with Sepolia's RPC URL
    blockExplorerUrls: ['https://optimistic.etherscan.io'] // Replace with Sepolia's block explorer URL
  }
}

export const setChain = async (chainId: string) => {
  const networkId = '0x' + (await (window.ethereum as any)?.request({ method: 'net_version' }).catch(() => '1')).replace(/^0x/, '')

  if (!CHAIN_DETAILS[chainId]) {
    console.error(`Invalid chain ID: ${chainId}`)
    return
  }

  if (chainId !== networkId) {
    await (window.ethereum as any)?.request({
      method: 'wallet_addEthereumChain',
      params: [CHAIN_DETAILS[chainId]]
    })
  }
}
