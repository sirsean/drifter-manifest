import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header } from './layout.js';
import { selectAddress } from '../database.js';
import { connectWalletOnClick } from '../wallet.js';

function Connected({ address }) {
    const href = `/crew/${address}`;
    return (
        <ul>
            <li><Link to={href}>Your Crew</Link></li>
        </ul>
    );
}

function Unconnected() {
    return (
        <p><button onClick={connectWalletOnClick}>connect your wallet</button></p>
    );
}

function NoWallet() {
    return (
        <p>This app reads directly from the blockchain, so you will need to install a wallet.</p>
    );
}

export default function Home() {
    const address = useSelector(selectAddress);
    return (
        <div className="Home">
            <Header />
            <p>Browse your drifter crew manifest.</p>
            {window.ethereum && address && <Connected address={address} />}
            {window.ethereum && !address && <Unconnected />}
            {!window.ethereum && <NoWallet />}
        </div>
    );
}
