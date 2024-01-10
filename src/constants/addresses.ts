import { ChainId } from './chainId'

type AddressMap = { [chainId: string]: string }

export const NDNS_REGISTRY_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0x6e22E7b9f5a99D5921c14A88Aaf954502aC17B90',
    [ChainId.OPTIMISM]: '0x0',
}

export const DOT_NEC_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0x09eba32998888032CF4f806E5fb7A48932aE7022',
    [ChainId.OPTIMISM]: '0x0',
}
