import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { hooks } from "../connectors/metamask";
import { Link, useNavigate } from "react-router-dom";
import { toDNSWireFormat } from "../utils/dnsWire";
import { BytesLike, utils } from 'ethers';
import EnterOsName from "../components/EnterKnsName";
import Loader from "../components/Loader";
import OsHeader from "../components/KnsHeader";
import { NetworkingInfo, PageProps } from "../lib/types";
import { ipToNumber } from "../utils/ipToNumber";
import { getNetworkName, setChain } from "../utils/chain";

const {
  useAccounts,
} = hooks;

interface RegisterOsNameProps extends PageProps {}

function RegisterOsName({
  direct,
  setDirect,
  setOsName,
  dotOs,
  kns,
  openConnect,
  provider,
  closeConnect,
  setNetworkingKey,
  setIpAddress,
  setPort,
  setRouters,
  nodeChainId,
}: RegisterOsNameProps) {
  let accounts = useAccounts();
  let navigate = useNavigate();
  const chainName = getNetworkName(nodeChainId);
  const [loading, setLoading] = useState('');

  const [name, setName] = useState('')
  const [nameValidities, setNameValidities] = useState<string[]>([])

  const [triggerNameCheck, setTriggerNameCheck] = useState<boolean>(false)

  useEffect(() => {
    document.title = "Register"
  }, [])

  useEffect(() => setTriggerNameCheck(!triggerNameCheck), [provider]) // eslint-disable-line react-hooks/exhaustive-deps

  const enterOsNameProps = { name, setName, nameValidities, setNameValidities, dotOs, triggerNameCheck }

  let handleRegister = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!provider) return openConnect()

    try {
      setLoading('Please confirm the transaction in your wallet');

      const { networking_key, ws_routing: [ip_address, port], allowed_routers } =
        (await fetch('/generate-networking-info', { method: 'POST' }).then(res => res.json())) as NetworkingInfo

      const ipAddress = ipToNumber(ip_address)

      setNetworkingKey(networking_key)
      setIpAddress(ipAddress)
      setPort(port)
      setRouters(allowed_routers)

      const data: BytesLike[] = [
        direct
          ? (await kns.populateTransaction.setAllIp
            (utils.namehash(`${name}.os`), ipAddress, port, 0, 0, 0)).data!
          : (await kns.populateTransaction.setRouters
            (utils.namehash(`${name}.os`), allowed_routers.map(x => utils.namehash(x)))).data!,
        (await kns.populateTransaction.setKey(utils.namehash(`${name}.os`), networking_key)).data!
      ]

      setLoading('Please confirm the transaction in your wallet');

      try {
        await setChain(nodeChainId);
      } catch (error) {
        window.alert(`You must connect to the ${chainName} network to continue. Please connect and try again.`);
        throw new Error(`${chainName} not set`)
      }

      const dnsFormat = toDNSWireFormat(`${name}.os`);
      const tx = await dotOs.register(
        dnsFormat,
        accounts![0],
        data
      )

      setLoading('Registering KNS ID...');

      await tx.wait();
      setLoading('');
      setOsName(`${name}.os`);
      navigate("/set-password");
    } catch (error) {
      console.error('Registration Error:', error)
      setLoading('');
      alert('There was an error registering your dot-os-name, please try again.')
    }
  }, [name, direct, accounts, dotOs, kns, navigate, setOsName, provider, openConnect, setNetworkingKey, setIpAddress, setPort, setRouters, nodeChainId, chainName])

  return (
    <>
      <OsHeader msg="Register Kinode Name" openConnect={openConnect} closeConnect={closeConnect} nodeChainId={nodeChainId} />
      {Boolean(provider) && <form id="signup-form" className="col" onSubmit={handleRegister}>
        {loading ? (
          <Loader msg={loading} />
        ) : (
          <>
            <div className="login-row row" style={{ marginBottom: '1em', lineHeight: 1.5 }}>
              Set up your Kinode with a .os name
              <div className="tooltip-container" style={{ marginTop: -4 }}>
                <div className="tooltip-button">&#8505;</div>
                <div className="tooltip-content">Kinodes use a .os name in order to identify themselves to other nodes in the network</div>
              </div>
            </div>
            <EnterOsName {...enterOsNameProps} />
            <div className="row" style={{ marginTop: '1em' }}>
              <input type="checkbox" id="direct" name="direct" checked={direct} onChange={(e) => setDirect(e.target.checked)} autoFocus />
              <label htmlFor="direct" className="direct-node-message">
                Register as a direct node. If you are unsure leave unchecked.

                <div className="tooltip-container">
                  <div className="tooltip-button">&#8505;</div>
                  <div className="tooltip-content">A direct node publishes its own networking information on-chain: IP, port, so on.
                    An indirect node relies on the service of routers, which are themselves direct nodes.
                    Only register a direct node if you know what you’re doing and have a public, static IP address.</div>
                </div>
              </label>
            </div>
            <button disabled={nameValidities.length !== 0} type="submit">
              Register .os name
            </button>
            <Link to="/reset" style={{ color: "white", marginTop: '1em' }}>already have an dot-os-name?</Link>
          </>
        )}
      </form>}
    </>
  )
}

export default RegisterOsName;
