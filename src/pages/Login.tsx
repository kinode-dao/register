import React, { useCallback, useEffect, useRef, useState } from "react";
import { hooks } from "../connectors/metamask";
import { QNSRegistry, UqNFT } from "../abis/types";
import { useNavigate } from "react-router-dom";
import { namehash } from "ethers/lib/utils";
import { ipToNumber } from "../utils/ipToNumber";
import UqHeader from "../components/UqHeader";

const { useChainId, useProvider } = hooks;

type LoginProps = {
  direct: boolean;
  pw: string;
  uqName: string;
  setDirect: React.Dispatch<React.SetStateAction<boolean>>;
  setPw: React.Dispatch<React.SetStateAction<string>>;
  setUqName: React.Dispatch<React.SetStateAction<string>>;
  qns: QNSRegistry;
  uqNft: UqNFT;
  openConnect: () => void;
  appSizeOnLoad: number
};

function Login({
  direct,
  pw,
  uqName,
  setDirect,
  setPw,
  setUqName,
  qns,
  openConnect,
  appSizeOnLoad
}: LoginProps) {
  const chainId = useChainId();
  const provider = useProvider();
  const navigate = useNavigate();

  const [ipAddr, setIpAddr] = useState<number>(0);
  const [port, setPort] = useState<number>(0);
  const [routers, setRouters] = useState<string[]>([]);

  const [uploadKey, setUploadKey] = useState<boolean>(false);
  const [needKey, setNeedKey] = useState<boolean>(false);
  const [localKey, setLocalKey] = useState<string>("");
  const [localKeyFileName, setLocalKeyFileName] = useState<string>("");
  const [keyErrs, setKeyErrs] = useState<string[]>([]);

  const [pwErr, setPwErr] = useState<string>('');
  const [pwVet, setPwVet] = useState<boolean>(false);
  const [pwDebounced, setPwDebounced] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let response = await fetch("/info", { method: "GET" });
      let data = await response.json();
      setRouters(data.allowed_routers);
      setIpAddr(ipToNumber(data.ws_routing[0]));
      setPort(data.ws_routing[1]);

      response = await fetch("/has-keyfile", { method: "GET" });
      data = await response.json();

      setUploadKey(!data);
      setNeedKey(!data);
    })();
  }, []);

  const handlePassword = useCallback(async () => {
    try {
      const response = await fetch("/vet-keyfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyfile: localKey,
          password: pw,
        }),
      });

      const data = await response.json();

      setUqName(data.username);

      setPwVet(true);

      const errs = [...keyErrs];

      const ws = await qns.ws(namehash(data.username));

      let index = errs.indexOf(KEY_WRONG_NET_KEY);
      if (ws.publicKey != data.networking_key) {
        if (index == -1) errs.push(KEY_WRONG_NET_KEY);
      } else if (index != -1) errs.splice(index, 1);

      index = errs.indexOf(KEY_WRONG_IP);
      if(ws.ip == 0) 
        setDirect(false)
      else {
        setDirect(true)
        if (ws.ip != ipAddr && index == -1) 
          errs.push(KEY_WRONG_IP);
      }

      setKeyErrs(errs);
    } catch {
      setPwVet(false);
    }
    setPwDebounced(true);
  }, [localKey, pw, keyErrs, ipAddr, qns, setUqName, setDirect]);

  const pwDebouncer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (pwDebouncer.current) clearTimeout(pwDebouncer.current);

    pwDebouncer.current = setTimeout(async () => {
      if (pw != "") {
        if (pw.length < 6)
          setPwErr("Password must be at least 6 characters")
        else {
          setPwErr("")
          handlePassword()
        }
      }
    }, 500)

  }, [pw])

  const KEY_WRONG_NET_KEY = "Keyfile does not match public key";
  const KEY_WRONG_IP = "IP Address does not match records";

  // for if we check router validity in future
  // const KEY_BAD_ROUTERS = "Routers from records are offline"

  const handleKeyfile = (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalKey(reader.result as string);
      setLocalKeyFileName(file.name);
    };
    reader.readAsText(file);
  };

  const keyfileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyUploadClick = async (e: any) => {
    e.preventDefault();
    keyfileInputRef.current?.click();
  };

  const handleLogin = async () => {

    if (keyErrs.length == 0 && pwVet) {
      const response = await fetch("/boot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyfile: localKey,
          reset: false,
          password: pw,
          username: uqName,
          direct,
        }),
      });

      const interval = setInterval(async () => {
        const res = await fetch("/");
        if (Number(res.headers.get('content-length')) != appSizeOnLoad) {
          clearInterval(interval);
          window.location.replace("/");
        }
      }, 2000);
    }
  };

  const flipUploadKey = () => setUploadKey(needKey || !uploadKey);

  return (
    <>
      <UqHeader msg="Login to Uqbar" openConnect={openConnect} hideConnect />
      <div id="signup-form" className="col">
        <div className="login-row col"> Login as... {uqName} </div>

        <div className="login-row row"> 1. Select Keyfile </div>

        <div className="row" style={{ margin: ".5em .5em .5em 1.75em", alignSelf: 'flex-start' }} onClick={flipUploadKey}>
          <input
            style={{ marginRight: '1em' }}
            disabled={needKey}
            type="checkbox"
            checked={!uploadKey}
          />
          <label style={{ width: 260 }}>
            {needKey ? "No" : "Use"} Existing Keyfile
          </label>
        </div>

        <div
          style={{
            margin: ".5em .5em .5em 1.75em",
            alignSelf: 'flex-start',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: '100%'
          }}
          onClick={flipUploadKey}
        >
          <div className="row">
            <input
              style={{ marginRight: '1em' }}
              type="checkbox"
              checked={uploadKey}
            />
            <label style={{ width: 260 }}>
              Upload Keyfile
            </label>
          </div>
          {uploadKey && <button style={{ fontSize: "80%" }} onClick={handleKeyUploadClick}>
            {localKeyFileName ? "Change" : "Select"} Keyfile
          </button>}
          {Boolean(localKeyFileName) && <p>
            {" "}
            {localKeyFileName ? localKeyFileName : ".keyfile"}{" "}
          </p>}
          <input
            ref={keyfileInputRef}
            style={{ display: "none" }}
            type="file"
            onChange={handleKeyfile}
          />
        </div>

        <div className="login-row row" style={{ marginTop: '2em' }}> 2. Enter Password </div>

        <input
          style={{ width: '100%' }}
          type="password"
          id="password"
          required
          minLength={6}
          name="password"
          placeholder="Min 6 characters"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {pwErr && (
          <div className="row">
            {" "}
            <p style={{ color: "red" }}> {pwErr} </p>{" "}
          </div>
        )}
        {pwDebounced && !pwVet && 6 <= pw.length && (
          <div className="row">
            {" "}
            <p style={{ color: "red" }}> Password is incorrect </p>{" "}
          </div>
        )}

        <div className="col" style={{ width: '100%' }}>
          {keyErrs.map((x, i) => (
            <span key={i} className="key-err">
              {x}
            </span>
          ))}
          {keyErrs.length ? (
            <button onClick={() => navigate("/reset")}>
              {" "}
              Reset Networking Information{" "}
            </button>
          ) : (
            <button onClick={handleLogin}> Login </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
