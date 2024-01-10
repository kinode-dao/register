import { ethers } from "ethers";
import { NDNSRegistryResolver, DotNecRegistrar } from "../abis/types";

export interface PageProps {
  networkingKey: string,
  setNetworkingKey: React.Dispatch<React.SetStateAction<string>>,
  ipAddress: number,
  setIpAddress: React.Dispatch<React.SetStateAction<number>>,
  port: number,
  setPort: React.Dispatch<React.SetStateAction<number>>,
  routers: string[],
  setRouters: React.Dispatch<React.SetStateAction<string[]>>,
  direct: boolean,
  setDirect: React.Dispatch<React.SetStateAction<boolean>>,
  necName: string,
  setNecName: React.Dispatch<React.SetStateAction<string>>,

  key: string,
  keyFileName: string,
  setKeyFileName: React.Dispatch<React.SetStateAction<string>>,
  reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  pw: string,
  setPw: React.Dispatch<React.SetStateAction<string>>,
  dotNec: DotNecRegistrar,
  ndns: NDNSRegistryResolver,
  connectOpen: boolean,
  openConnect: () => void,
  closeConnect: () => void,
  provider?: ethers.providers.Web3Provider,
  appSizeOnLoad: number,
}

export type NetworkingInfo = {
  networking_key: string,
  ws_routing: [
    ip_address: string,
    port: number
  ],
  allowed_routers: string[]
}

export type UnencryptedIdentity = {
  name: string,
  allowed_routers: string[]
}
