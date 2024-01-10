import { useWeb3React } from "@web3-react/core";
import { hooks, metaMask } from "../connectors/metamask";
import { useCallback, useEffect, useState } from "react";
import Loader from "./Loader";
import { setSepolia } from "../utils/chain";
import ChainInfo from "./ChainInfo";

const { useIsActivating, useChainId } = hooks;

type NecHeaderProps = {
    msg: string,
    openConnect: () => void,
    closeConnect: () => void
    hideConnect?: boolean,
}

function NecHeader({ msg, openConnect, closeConnect, hideConnect = false }: NecHeaderProps) {
    const { account, isActive } = useWeb3React()
    const isActivating = useIsActivating();
    const chainId = useChainId();

    const [networkName, setNetworkName] = useState('');

    useEffect(() => {
        setNetworkName(getNetworkName((chainId || 1).toString()));
    }, [chainId]);

    const getNetworkName = (networkId: string) => {
        switch (networkId) {
            case '1':
                return 'Ethereum'; // Ethereum Mainnet
            case '10':
                return 'Optimism'; // Optimism
            case '42161':
                return 'Arbitrum'; // Arbitrum One
            case '11155111':
                return 'Sepolia'; // Sepolia Testnet
            default:
                return 'Unknown';
        }
    };

    const connectWallet = useCallback(async () => {
        closeConnect()
        await metaMask.activate().catch(() => { })

        try {
            setSepolia()
        } catch (error) {
            console.error(error)
        }
    }, [closeConnect]);

    const changeToSepolia = useCallback(async () => {
        // If Sepolia is set, just show a message
        if (networkName === 'Sepolia') {
            alert('You are already connected to Sepolia');
            return;
        }

        try {
            setSepolia()
        } catch (error) {
            console.error(error)
        }
    }, [networkName]);

    const changeConnectedAccount = useCallback(async () => {
        alert('You can change your connected account in your wallet.')
    }, []);

    // <div style={{ textAlign: 'center', lineHeight: 1.5 }}> Connected as {account?.slice(0,6) + '...' + account?.slice(account.length - 6)}</div>
    return (
        <>
            <div id="signup-form-header" className="col" >
                <h1 style={{ textAlign: "center" }}>
                    <img alt="icon" style={{ margin: "0 1em 0.2em 0" }} src="data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAqhP/x////AP///wAqhP//KoT//////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD/4xwJ////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////ACmE/7MqhP//////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////AP///wD///8A////AP/fIBD53CD/+N4hJ////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8A////AP///wD///8A/98gEPncIP/53CD/+dwg/////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AK4X/zP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD/3yAQ+dwg//ncIP/53CD/+dwg/////wD///8A////AP///wD///8A////AP///wD///8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////AP///wD///8A////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg/////wD///8A////AP///wD///8A////AP///wD///8AKoT//yuF/8z///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8A////AP///wD///8A/98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg/////wD///8A////AP///wD///8A////AP///wAqhP//K4X/zP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD/3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/9twjHf///wD///8A////AP///wD///8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////AP///wD///8A////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/////AP///wD///8AKoT//////wD///8AKoT//yuF/8z///8AKoT//yqE//////8A////ACqE//////8A////AP///wD///8A////ACqE//8qhP/D////AP///wD///8A/98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CCx////AP///wAqhP//////AP///wAqhP//K4X/zP///wAqhP//KoT//////wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//8qhP//////AP///wD/3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP////8A////ACqE//////8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wD///8A////AP///wD///8A////AP///wAqhP//KoT//yqE//8qhP//////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg/////wAqhP//KoT//////wD///8AKoT//yuF/8z///8AKoT//yqE//////8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//KoT//yqE//8qhP///98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwfyyqE//8qhP//////AP///wAqhP//K4X/zP///wAqhP//////AP///wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//8qhP//KoT//yqE////3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/KoT//yqE//////8A////ACqE//8rhf/M////ACqE//////8A////AP///wD///8A////AP///wD///8A////AP///wAqhP//KoT//yqE//8qhP//KoT////fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP8qhP//KoT//////wD///8AKoT//yuF/8z///8AKoT//////wD///8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//KoT//yqE//8qhP//Lob7wPncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg/yqE//8qhP//////AP///wAqhP//K4X/zP///wAqhP//////AP///wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//8qhP//KoT//yqE//8thvvL+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/KoT//yqE//////8A////ACqE//8rhf/M////ACqE//////8A////AP///wD///8A////AP///wD///8A////AP///wAqhP//KoT//yqE//8qhP//KoT////fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP8qhP//KoT//////wD///8AKoT//yuF/8z///8AKoT//////wD///8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//KoT//yqE//8qhP///98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg/yqE//8qhP//////AP///wAqhP//K4X/zP///wAqhP//KoT//////wD///8A////AP///wD///8A////AP///wD///8AKoT//yqE//8qhP//KoT//yqE////3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53B/7AKr/AyqE//////8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wD///8A////AP///wD///8A////AP///wAqhP//KoT//yqE//8qhP//////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg/////wD///8AKoT//////wD///8AKoT//yuF/8z///8AKoT//yqE//////8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//KoT//////wD///8A/98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/////AP///wAqhP//////AP///wAqhP//K4X/zP///wAqhP//KoT//////wD///8AKoT/kf///wD///8A////AP///wD///8AKoT//yqE//////8A////AP///wD/3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/+dwg//ncIP7///8A////AP///wD///8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8AKoT/3SqE//////8A////AP///wD///8A////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg//ncIP/53CD/////AP///wD///8A////AP///wD///8AKoT//yuF/8z///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8A////AP///wD///8A/98gEPncIP/53CD/+dwg//ncIP/53CD/+dwg//rcIL3///8A////AP///wD///8A////AP///wAqhP//K4X/zP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD/3yAQ+dwg//ncIP/53CD/+dwg//ncIP/53CD/////AP///wD///8A////AP///wD///8A////ACqE//8rhf/M////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////AP///wD///8A////AP/fIBD53CD/+dwg//ncIP/53CD/+dwg/////wD///8A////AP///wD///8A////AP///wD///8A////ACuF/8z///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8A////AP///wD///8A/98gEPncIP/53CD/+dwg//ncIP////8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD/3yAQ+dwg//ncIP/53CD/////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8AKoT//yqE//////8A////AP///wD///8A////AP/fIBD53CD/+dwg9////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////ACqE//8qhP//////AP///wAqhP//KoT//////wD///8A////AP///wD///8A/98gEP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AAKr/AyqE//////8A////ACqE//8qhP//////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//Z////mff/+Znx//mZ8P/pmfB/yZnwP8mZ8B/JmfAPyZnwDsm+cAbJ/jAGyf4QBMn+AADL/gAAy/4AAMv+AADL/gAAy/4AAMv+AADJ/gAAyf4QBsn+MAbJvnAHyZnwD8mZ8A/JmfAfyZnwP+mZ8H/5mfD/+Znx//+Z9///mf/8=" />
                    {msg}
                </h1>
                {!hideConnect && <div style={{ minWidth: '50vw', width: 400, justifyContent: 'center', display: 'flex', }}>
                    {isActive && account
                        ? (
                            <ChainInfo
                                account={account}
                                networkName={networkName}
                                changeToSepolia={changeToSepolia}
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
                                <div style={{ textAlign: 'center', lineHeight: '1.5em', fontSize: '0.8em', marginTop: '2em' }}>
                                    Nectar is currently on the Sepolia Testnet, if you need testnet ETH, you can get some from the <a href="https://sepoliafaucet.com/" target="_blank" rel="noreferrer">Sepolia Faucet</a>
                                </div>
                            </div>
                        )
                    }
                </div>}
            </div>
        </>
    )
}

export default NecHeader
