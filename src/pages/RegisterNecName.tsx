import React, { useState, useEffect, FormEvent, useCallback } from "react";
import { hooks } from "../connectors/metamask";
import { Link, useNavigate } from "react-router-dom";
import { toDNSWireFormat } from "../utils/dnsWire";
import { BytesLike, utils } from 'ethers';
import EnterNecName from "../components/EnterNecName";
import Loader from "../components/Loader";
import NecHeader from "../components/NecHeader";
import { NetworkingInfo, PageProps } from "../lib/types";
import { ipToNumber } from "../utils/ipToNumber";
import { setSepolia } from "../utils/chain";

const {
  useAccounts,
} = hooks;

interface RegisterNecNameProps extends PageProps {

}

function RegisterNecName({
  direct,
  setDirect,
  setNecName,
  dotNec,
  ndns,
  openConnect,
  provider,
  closeConnect,
  setNetworkingKey,
  setIpAddress,
  setPort,
  setRouters,
}: RegisterNecNameProps) {
  let accounts = useAccounts();
  let navigate = useNavigate();
  const [loading, setLoading] = useState('');

  const [name, setName] = useState('')
  const [nameValidities, setNameValidities] = useState<string[]>([])

  const [triggerNameCheck, setTriggerNameCheck] = useState<boolean>(false)

  useEffect(() => {
    document.title = "Register"
  }, [])

  useEffect(() => setTriggerNameCheck(!triggerNameCheck), [provider]) // eslint-disable-line react-hooks/exhaustive-deps

  const enterNecNameProps = { name, setName, nameValidities, setNameValidities, dotNec, triggerNameCheck }

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
          ? (await ndns.populateTransaction.setAllIp
            (utils.namehash(`${name}.nec`), ipAddress, port, 0, 0, 0)).data!
          : (await ndns.populateTransaction.setRouters
            (utils.namehash(`${name}.nec`), allowed_routers.map(x => utils.namehash(x)))).data!,
        (await ndns.populateTransaction.setKey(utils.namehash(`${name}.nec`), networking_key)).data!
      ]

      setLoading('Please confirm the transaction in your wallet');

      try {
        await setSepolia();
      } catch (error) {
        window.alert("You must connect to the Sepolia network to continue. Please connect and try again.");
        throw new Error('Sepolia not set')
      }

      const dnsFormat = toDNSWireFormat(`${name}.nec`);
      const tx = await dotNec.register(
        dnsFormat,
        accounts![0],
        data
      )

      setLoading('Registering NDNS ID...');

      await tx.wait();
      setLoading('');
      setNecName(`${name}.nec`);
      navigate("/set-password");
    } catch {
      setLoading('');
      alert('There was an error registering your nec-name, please try again.')
    }
  }, [name, direct, accounts, dotNec, ndns, navigate, setNecName, provider, openConnect, setNetworkingKey, setIpAddress, setPort, setRouters])

  return (
    <>
      <NecHeader msg="Register Nectar Node" openConnect={openConnect} closeConnect={closeConnect} />
      {Boolean(provider) && <form id="signup-form" className="col" onSubmit={handleRegister}>
        {loading ? (
          <Loader msg={loading} />
        ) : (
          <>
            <div className="login-row row" style={{ marginBottom: '1em', lineHeight: 1.5 }}>
              Set up your Nectar node with a .nec name
              <div className="tooltip-container" style={{ marginTop: -4 }}>
                <div className="tooltip-button">&#8505;</div>
                <div className="tooltip-content">Nectar nodes use a .nec name in order to identify themselves to other nodes in the network</div>
              </div>
            </div>
            <EnterNecName {...enterNecNameProps} />
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
              Register Necname
            </button>
            <Link to="/reset" style={{ color: "white", marginTop: '1em' }}>already have an nec-name?</Link>
          </>
        )}
      </form>}
    </>
  )
}

export default RegisterNecName;
