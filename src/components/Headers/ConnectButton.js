import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setConnected,
    connectState,
    disconnected,
} from '../../app/reducers/walletSlice';
import { getBalance } from 'utils/contract';


function ConnectButton() {
    const [wallet, setWallet] = useState("0x0");
    const [balance, setBalance] = useState(0);

    const connected = useSelector(connectState);
    const dispatch = useDispatch();

    const checkWalletIsInstalled = () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Install MetaMask");
            return;
        } else {
            console.log("Ready to go");
        }
    }

    const connectWalletHandler = useCallback(async () => {
        const { ethereum } = window;
        
        ethereum.on('accountsChanged', async function (accounts) {
            let wallet = accounts[0];
            if (wallet) {
                let balance = await getBalance(wallet);
                setBalance(balance);
                setWallet(wallet);
                dispatch(setConnected(wallet.toString()))
            } else {
                await disconnectWalletHandler();
            }
        });
        ethereum.on('networkChanged', async function (networkId) {
            if(networkId !== '0xa869') {
                disconnectWalletHandler();
            }
        })
          

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await window.ethereum.request({ method: 'eth_chainId'});
            console.log(chainId);
            if(chainId === '0xa869') {
                let wallet = accounts[0];
                let balance = await getBalance(wallet);
                setBalance(balance);
                setWallet(wallet);
                dispatch(setConnected(wallet.toString()))
            } else {
                alert("Connect to Avalanche Testnet");
            }
        } catch (err) {
            console.log(err);
        }
    }, [connected, dispatch]);

    const disconnectWalletHandler = () => {
        setWallet('0x0');
        dispatch(disconnected());
    }

    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} type="button" className="btn btn-dark">
                Connect Wallet
            </button>
        )
    }

    const disconnectWalletButton = () => {
        
        return (
            <div>
                <button type="button" className="mr-2 btn btn-dark">
                    {(balance/1000000000000000000).toFixed(2)}
                </button>
                <button type="button" className="mr-2 btn btn-dark">
                    {wallet.substring(0, 6)}...{wallet.substring(38, 42)} 
                </button>
                <button onClick={disconnectWalletHandler} type="button" className="btn btn-dark">
                    Disconnect Wallet
                </button>
            </div>
        )
    }
  
    useEffect(() => {
        checkWalletIsInstalled();
    }, [])

    return (
        <div>
            {!connected ? connectWalletButton() : disconnectWalletButton()}
        </div>
    )
}

export default ConnectButton;