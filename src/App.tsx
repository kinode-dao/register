import { useState, useEffect } from "react";
import { Navigate, BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { hooks } from "./connectors/metamask";
import {
  NDNS_REGISTRY_ADDRESSES,
  DOT_NEC_ADDRESSES,
} from "./constants/addresses";
import { ChainId } from "./constants/chainId";
import { NDNSRegistryResolver, NDNSRegistryResolver__factory, DotNecRegistrar, DotNecRegistrar__factory } from "./abis/types";
import { ethers } from "ethers";
import ConnectWallet from "./components/ConnectWallet";
import RegisterNecName from "./pages/RegisterNecName";
import ClaimNecInvite from "./pages/ClaimNecInvite";
import SetPassword from "./pages/SetPassword";
import Login from './pages/Login'
import Reset from './pages/ResetNecName'
import NecHome from "./pages/NecHome"
import ImportKeyfile from "./pages/ImportKeyfile";
import { UnencryptedIdentity } from "./lib/types";

const {
  useProvider,
} = hooks;

function App() {
  const provider = useProvider();
  const params = useParams()

  const [pw, setPw] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [keyFileName, setKeyFileName] = useState<string>('');
  const [reset, setReset] = useState<boolean>(false);
  const [direct, setDirect] = useState<boolean>(false);
  const [necName, setNecName] = useState<string>('');
  const [appSizeOnLoad, setAppSizeOnLoad] = useState<number>(0);
  const [networkingKey, setNetworkingKey] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<number>(0);
  const [port, setPort] = useState<number>(0);
  const [routers, setRouters] = useState<string[]>([]);
  const [nodeChainId, setNodeChainId] = useState('')

  const [navigateToLogin, setNavigateToLogin] = useState<boolean>(false)
  const [initialVisit, setInitialVisit] = useState<boolean>(!params?.initial)

  const [connectOpen, setConnectOpen] = useState<boolean>(false);
  const openConnect = () => setConnectOpen(true)
  const closeConnect = () => setConnectOpen(false)

  const [dotNec, setDotNec] = useState<DotNecRegistrar>(
    DotNecRegistrar__factory.connect(
      DOT_NEC_ADDRESSES[ChainId.SEPOLIA],
      new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL))
  );

  const [ndns, setNdns] = useState<NDNSRegistryResolver>(
    NDNSRegistryResolver__factory.connect(
      NDNS_REGISTRY_ADDRESSES[ChainId.SEPOLIA],
      new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL))
  );

  useEffect(() => setAppSizeOnLoad(
    (window.performance.getEntriesByType('navigation') as any)[0].transferSize
  ), []);

  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await fetch('/info', { method: 'GET' })

        if (infoResponse.status > 399) {
          console.log('no info, unbooted')
        } else {
          const info: UnencryptedIdentity = await infoResponse.json()

          if (initialVisit) {
            setNecName(info.name)
            setRouters(info.allowed_routers)
            setNavigateToLogin(true)
            setInitialVisit(false)
          }
        }
      } catch {
        console.log('no info, unbooted')
      }

      try {
        const currentChainResponse = await fetch('/current-chain', { method: 'GET' })

        if (currentChainResponse.status < 400) {
          const nodeChainId = await currentChainResponse.json()
          setNodeChainId(nodeChainId.toLowerCase())
          console.log('Node Chain ID:', nodeChainId)
        }
      } catch {
        console.log('error getting current chain')
      }
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setNavigateToLogin(false), [initialVisit])

  useEffect(() => {
    if (provider) {
      setDotNec(DotNecRegistrar__factory.connect(
        DOT_NEC_ADDRESSES[ChainId.SEPOLIA],
        provider!.getSigner())
      )
      setNdns(NDNSRegistryResolver__factory.connect(
        NDNS_REGISTRY_ADDRESSES[ChainId.SEPOLIA],
        provider!.getSigner())
      )
    }
  }, [provider])

  // just pass all the props each time since components won't mind extras
  const props = {
    direct, setDirect,
    key,
    keyFileName, setKeyFileName,
    reset, setReset,
    pw, setPw,
    necName, setNecName,
    dotNec, ndns,
    connectOpen, openConnect, closeConnect,
    provider, appSizeOnLoad,
    networkingKey, setNetworkingKey,
    ipAddress, setIpAddress,
    port, setPort,
    routers, setRouters,
    nodeChainId,
  }

  return (
    <>
      {
        <>
          <ConnectWallet {...props} />
          <Router>
            <Routes>
              <Route path="/" element={navigateToLogin
                ? <Navigate to="/login" replace />
                : <NecHome {...props} />
              } />
              <Route path="/claim-invite" element={<ClaimNecInvite {...props} />} />
              <Route path="/register-name" element={<RegisterNecName  {...props} />} />
              <Route path="/set-password" element={<SetPassword {...props} />} />
              <Route path="/reset" element={<Reset {...props} />} />
              <Route path="/import-keyfile" element={<ImportKeyfile {...props} />} />
              <Route path="/login" element={<Login {...props} />} />
            </Routes>
          </Router>
        </>
      }
    </>
  )
}

export default App;
