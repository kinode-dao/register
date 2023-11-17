import { ethers } from "ethers";
import { QNSRegistry, UqNFT } from "../abis/types";

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
  uqName: string,
  setUqName: React.Dispatch<React.SetStateAction<string>>,

  key: string,
  keyFileName: string,
  setKeyFileName: React.Dispatch<React.SetStateAction<string>>,
  reset: boolean,
  setReset: React.Dispatch<React.SetStateAction<boolean>>,
  pw: string,
  setPw: React.Dispatch<React.SetStateAction<string>>,
  uqNft: UqNFT,
  qns: QNSRegistry,
  connectOpen: boolean,
  openConnect: () => void,
  closeConnect: () => void,
  provider?: ethers.providers.Web3Provider,
  appSizeOnLoad: number,
}