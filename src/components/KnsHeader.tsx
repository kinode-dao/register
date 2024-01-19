import { useWeb3React } from "@web3-react/core";
import { hooks, metaMask } from "../connectors/metamask";
import { useCallback, useEffect, useState } from "react";
import Loader from "./Loader";
import { getNetworkName, setChain } from "../utils/chain";
import ChainInfo from "./ChainInfo";
import { SEPOLIA_OPT_HEX } from "../constants/chainId";
import kinode_logo from '../assets/kinode-logo.png';

const { useIsActivating, useChainId } = hooks;

type OsHeaderProps = {
    msg: string,
    nodeChainId: string,
    openConnect: () => void,
    closeConnect: () => void,
    hideConnect?: boolean,
}

function OsHeader({ msg, openConnect, closeConnect, nodeChainId, hideConnect = false }: OsHeaderProps) {
    const { account, isActive } = useWeb3React()
    const isActivating = useIsActivating();
    const chainId = useChainId();

    const [networkName, setNetworkName] = useState('');

    useEffect(() => {
        setNetworkName(getNetworkName((chainId || 1).toString()));
    }, [chainId]);

    const connectWallet = useCallback(async () => {
        closeConnect()
        await metaMask.activate().catch(() => { })

        try {
            setChain(nodeChainId)
        } catch (error) {
            console.error(error)
        }
    }, [closeConnect, nodeChainId]);

    const changeToNodeChain = useCallback(async () => {
        // If correct ndetwork is set, just say that
        if (chainId) {
            const hexChainId = '0x' + chainId.toString(16)
            if (hexChainId === nodeChainId) {
                return alert(`You are already connected to ${getNetworkName(chainId.toString())}`);
            }

            try {
                setChain(nodeChainId)
            } catch (error) {
                console.error(error)
            }
        }
    }, [chainId, nodeChainId]);

    const changeConnectedAccount = useCallback(async () => {
        alert('You can change your connected account in your wallet.')
    }, []);

    // <div style={{ textAlign: 'center', lineHeight: 1.5 }}> Connected as {account?.slice(0,6) + '...' + account?.slice(account.length - 6)}</div>
    return (
        <>
            <div id="signup-form-header" className="col" >
                <h1 className="row" style={{ display: 'flex', flexDirection: 'row' }}>
                    <img alt="icon" style={{ margin: "0 1em 0.2em 0", height: 60, width: 60 }} src={kinode_logo} />
                    {msg}
                </h1>
                {!hideConnect && <div style={{ minWidth: '50vw', width: 400, justifyContent: 'center', display: 'flex', }}>
                    {isActive && account
                        ? (
                            <ChainInfo
                                account={account}
                                networkName={networkName}
                                changeToNodeChain={changeToNodeChain}
                                changeConnectedAccount={changeConnectedAccount}
                            />
                        ) : (
                            <div className="col">
                                <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>You must connect to a browser wallet to continue</div>
                                {/* <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>We recommend <a href="https://metamask.io/download.html" target="_blank" rel="noreferrer">MetaMask</a></div> */}
                                {isActivating ? (
                                    <Loader msg="Approve connection in your wallet" />
                                ) : (
                                    <button onClick={connectWallet}> Connect Wallet </button>
                                )}
                                {nodeChainId === SEPOLIA_OPT_HEX && <div style={{ textAlign: 'center', lineHeight: '1.5em', fontSize: '0.8em', marginTop: '2em' }}>
                                    Kinode is currently on the Sepolia Testnet, if you need testnet ETH, you can get some from the <a href="https://sepoliafaucet.com/" target="_blank" rel="noreferrer">Sepolia Faucet</a>
                                </div>}
                            </div>
                        )
                    }
                </div>}
            </div>
        </>
    )
}

export default OsHeader
