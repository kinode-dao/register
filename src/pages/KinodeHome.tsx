import { useNavigate } from "react-router-dom"
import OsHeader from "../components/KnsHeader"
import { useEffect } from "react"

type OsHomeProps = {
    openConnect: () => void
    provider: any
    knsName: string
    closeConnect: () => void
    nodeChainId: string
}

function OsHome({ openConnect, knsName, provider, closeConnect, nodeChainId }: OsHomeProps) {
    const navigate = useNavigate()
    const inviteRedir = () => navigate('/claim-invite')
    const registerRedir = () => navigate('/register-name')
    const resetRedir = () => navigate('/reset')
    const importKeyfileRedir = () => navigate('/import-keyfile')
    const loginRedir = () => navigate('/login')

    const previouslyBooted = Boolean(knsName)

    const hasNetwork = Boolean(window.ethereum)

    useEffect(() => {
        document.title = "Welcome"
    }, [])

    return (
        <>
            <OsHeader msg="Welcome to Kinode" openConnect={openConnect} closeConnect={closeConnect} hideConnect nodeChainId={nodeChainId} />
            <div style={{ maxWidth: 'calc(100vw - 32px)', width: 420 }}>
                {previouslyBooted ? (
                    <button onClick={loginRedir}> Login </button>
                ) : (
                    <>
                        {!hasNetwork && <h4 style={{ marginBottom: '0.5em', fontSize: '0.8em' }}>
                            You must install a Web3 wallet extension like Metamask in order to register or reset a username.
                        </h4>}
                        {hasNetwork && <h4 style={{ marginBottom: '0.5em' }}>New here? Register a username to get started</h4>}
                        <button disabled={!hasNetwork} onClick={registerRedir}> Register Kinode Name </button>
                        <br />
                        <h4 style={{ marginBottom: '0.5em' }}>Other options</h4>
                        <button disabled={!hasNetwork} onClick={inviteRedir}> Claim Kinode Invite </button>
                        <button disabled={!hasNetwork} onClick={resetRedir}> Reset Kinode Name </button>
                        <button onClick={importKeyfileRedir}> Import Keyfile </button>
                    </>
                )}
            </div>
        </>
    )
}

export default OsHome