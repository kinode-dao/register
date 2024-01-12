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
