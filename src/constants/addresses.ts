import { ChainId } from './chainId'

type AddressMap = { [chainId: string]: string }

export const NDNS_REGISTRY_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0xa11e3794e701565aD37f84DD364d581f5e9518c9',
    [ChainId.OPTIMISM]: '0x942A69Cc3dd5d9a87c35f13ebA444adc00934B0F',
}

export const DOT_NEC_ADDRESSES: AddressMap = {
    [ChainId.SEPOLIA]: '0x872Ac3454f6834f8BBC79F96d3D749EE6F8fE913',
    [ChainId.OPTIMISM]: '0x7fccd23e47a4830b0a59df30624f3d1dab863e7c',
}
