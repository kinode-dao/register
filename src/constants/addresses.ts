import { ChainId } from './chainId'

type AddressMap = { [chainId: string]: string }

export const KNS_REGISTRY_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0x3807fBD692Aa5c96F1D8D7c59a1346a885F40B1C',
    [ChainId.OPTIMISM]: '0xca5b5811c0C40aAB3295f932b1B5112Eb7bb4bD6',
}

export const DOT_OS_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0xC5a939923E0B336642024b479502E039338bEd00',
    [ChainId.OPTIMISM]: '0x66929F55Ea1E38591f9430E5013C92cdC01F6cAd',
}
