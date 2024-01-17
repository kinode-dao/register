import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { namehash } from "ethers/lib/utils";
import { BytesLike } from "ethers";

import OsHeader from "../components/KnsHeader";
import { NetworkingInfo, PageProps, UnencryptedIdentity } from "../lib/types";
import Loader from "../components/Loader";
import { hooks } from "../connectors/metamask";
import { ipToNumber } from "../utils/ipToNumber";
import { downloadKeyfile } from "../utils/download-keyfile";

const { useProvider } = hooks;

interface LoginProps extends PageProps { }

function Login({
  direct,
  setDirect,
  pw,
  setPw,
  kns,
  openConnect,
  appSizeOnLoad,
  closeConnect,
  routers,
  setRouters,
  knsName,
  setOsName,
  nodeChainId,
}: LoginProps) {
  const provider = useProvider();

  const [keyErrs, setKeyErrs] = useState<string[]>([]);
  const [loading, setLoading] = useState<string>("");
  const [showReset, setShowReset] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [restartFlow, setRestartFlow] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Login";

    (async () => {
      try {
        const infoData = (await fetch("/info", { method: "GET" }).then((res) =>
          res.json()
        )) as UnencryptedIdentity;
        setRouters(infoData.allowed_routers);
        setOsName(infoData.name);
      } catch { }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // for if we check router validity in future
  // const KEY_BAD_ROUTERS = "Routers from records are offline"

  const handleLogin = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      try {
        if (reset) {
          if (!provider) {
            setKeyErrs(["Please connect your wallet and try again"]);
            setRestartFlow(true);
            return openConnect();
          }

          setLoading("Checking password...");

          // Replace this with network key generation
          const response = await fetch("/vet-keyfile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw, keyfile: "" }),
          });

          if (response.status > 399) {
            throw new Error("Incorrect password");
          }

          // Generate keys on server that are stored temporarily
          const {
            networking_key,
            ws_routing: [ip_address, port],
            allowed_routers,
          } = (await fetch("/generate-networking-info", {
            method: "POST",
          }).then((res) => res.json())) as NetworkingInfo;

          setLoading("Please confirm the transaction in your wallet");

          const ipAddress = ipToNumber(ip_address);

          const data: BytesLike[] = [
            direct
              ? (
                await kns.populateTransaction.setAllIp(
                  namehash(knsName),
                  ipAddress,
                  port,
                  0,
                  0,
                  0
                )
              ).data!
              : (
                await kns.populateTransaction.setRouters(
                  namehash(knsName),
                  allowed_routers.map((x) => namehash(x))
                )
              ).data!,
            (
              await kns.populateTransaction.setKey(
                namehash(knsName),
                networking_key
              )
            ).data!,
          ];

          setLoading("Please confirm the transaction");

          const tx = await kns.multicall(data);

          setLoading("Resetting Networking Information...");

          await tx.wait();
        }

        setLoading("Logging in...");

        // Login or confirm new keys
        const result = await fetch(
          reset ? "/confirm-change-network-keys" : "login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: reset
              ? JSON.stringify({ password: pw, direct })
              : JSON.stringify({ password: pw }),
          }
        );

        if (result.status > 399) {
          throw new Error(await result.text());
        }

        if (reset) {
          const base64String = await result.json();
          downloadKeyfile(knsName, base64String);
        }

        const interval = setInterval(async () => {
          const res = await fetch("/");
          if (Number(res.headers.get("content-length")) !== appSizeOnLoad) {
            clearInterval(interval);
            window.location.replace("/");
          }
        }, 2000);
      } catch (err: any) {
        const errorString = String(err);
        if (errorString.includes("Object")) {
          setKeyErrs([
            "There was an error with the transaction, or it was cancelled.",
          ]);
        } else {
          setKeyErrs([errorString]);
        }
        setLoading("");
      }
    },
    [pw, appSizeOnLoad, reset, direct, knsName, provider, openConnect, kns]
  );

  const isDirect = Boolean(routers?.length === 0);

  return (
    <>
      <OsHeader
        msg="Login to Kinode"
        openConnect={openConnect}
        closeConnect={closeConnect}
        hideConnect={!showReset}
        nodeChainId={nodeChainId}
      />
      {loading ? (
        <Loader msg={loading} />
      ) : (
        <form id="signup-form" className="col" onSubmit={handleLogin}>
          <div className="login-row col" style={{ marginLeft: "0.4em" }}>
            {" "}
            Login as {knsName}{" "}
          </div>
          <div className="login-row row" style={{ marginTop: "1em" }}>
            {" "}
            Enter Password{" "}
          </div>
          <input
            style={{ width: "100%" }}
            type="password"
            id="password"
            required
            minLength={6}
            name="password"
            placeholder="Min 6 characters"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />

          <div className="col" style={{ width: "100%", lineHeight: 1.5 }}>
            {keyErrs.map((x, i) => (
              <span key={i} className="key-err">
                {x}
              </span>
            ))}
            <button type="submit"> {reset ? "Reset & " : ""} Login </button>
            {/* <button onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate('/?initial=false', { replace: true });
              }}>Main Menu</button> */}
            <div
              className="login-row col"
              style={{
                marginLeft: "0.4em",
                fontSize: "0.8em",
                lineHeight: 1.5,
              }}
            >
              Registered as {isDirect ? "a direct" : "an indirect"} node
            </div>
            <div
              className="reset-networking"
              onClick={() => {
                setShowReset(!showReset);
                setReset(!showReset);
              }}
            >
              Reset Networking Info
            </div>
            {showReset && (
              <>
                <div className="row" style={{ marginTop: "1em" }}>
                  <input
                    type="checkbox"
                    id="reset"
                    name="reset"
                    checked={reset}
                    onChange={(e) => setReset(e.target.checked)}
                  />
                  <label htmlFor="reset" className="direct-node-message">
                    Reset networking keys and publish on-chain
                    <div className="tooltip-container">
                      <div className="tooltip-button">&#8505;</div>
                      <div className="tooltip-content">
                        This will update your networking keys and publish the
                        new info on-chain
                      </div>
                    </div>
                  </label>
                </div>
                <div className="row" style={{ marginTop: "1em" }}>
                  <input
                    type="checkbox"
                    id="direct"
                    name="direct"
                    checked={direct}
                    onChange={(e) => setDirect(e.target.checked)}
                  />
                  <label htmlFor="direct" className="direct-node-message">
                    Register as a direct node. If you are unsure leave
                    unchecked.
                    <div className="tooltip-container">
                      <div className="tooltip-button">&#8505;</div>
                      <div className="tooltip-content">
                        A direct node publishes its own networking information
                        on-chain: IP, port, so on. An indirect node relies on
                        the service of routers, which are themselves direct
                        nodes. Only register a direct node if you know what
                        you’re doing and have a public, static IP address.
                      </div>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>
        </form>
      )}
    </>
  );
}

export default Login;
