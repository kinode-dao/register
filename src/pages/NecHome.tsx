import { useNavigate } from "react-router-dom"
import NecHeader from "../components/NecHeader"
import { useEffect } from "react"

type NecHomeProps = {
    openConnect: () => void
    provider: any
    necName: string
    closeConnect: () => void
    nodeChainId: string
}

function NecHome({ openConnect, necName, provider, closeConnect, nodeChainId }: NecHomeProps) {
    const navigate = useNavigate()
    const inviteRedir = () => navigate('/claim-invite')
    const registerRedir = () => navigate('/register-name')
    const resetRedir = () => navigate('/reset')
    const importKeyfileRedir = () => navigate('/import-keyfile')
    const loginRedir = () => navigate('/login')

    const previouslyBooted = Boolean(necName)

    const hasNetwork = Boolean(window.ethereum)

    useEffect(() => {
        document.title = "Welcome"
    }, [])

    return (
        <>
            <NecHeader msg="Welcome to Nectar" openConnect={openConnect} closeConnect={closeConnect} hideConnect nodeChainId={nodeChainId} />
            <div style={{ maxWidth: 'calc(100vw - 32px)', width: 420 }}>
                {previouslyBooted ? (
                    <button onClick={loginRedir}> Login </button>
                ) : (
                    <>
                        {!hasNetwork && <h4 style={{ marginBottom: '0.5em', fontSize: '0.8em' }}>
                            You must install a Web3 wallet extension like Metamask in order to register or reset a username.
                        </h4>}
                        {hasNetwork && <h4 style={{ marginBottom: '0.5em' }}>New here? Register a username to get started</h4>}
                        <button disabled={!hasNetwork} onClick={registerRedir}> Register NecName </button>
                        <br />
                        <h4 style={{ marginBottom: '0.5em' }}>Other options</h4>
                        <button disabled={!hasNetwork} onClick={inviteRedir}> Claim Nec Invite </button>
                        <button disabled={!hasNetwork} onClick={resetRedir}> Reset NecName </button>
                        <button onClick={importKeyfileRedir}> Import Keyfile </button>
                    </>
                )}
            </div>
        </>
    )
}

export default NecHome