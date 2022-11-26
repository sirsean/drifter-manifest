import React from 'react';
import { useSelector } from 'react-redux';
import {
    Link,
    useParams,
} from 'react-router-dom';
import { Page } from './layout.js';
import {
    refreshWalletDrifters,
} from '../client.js';
import {
    selectWalletDrifters,
    selectDrifter,
} from '../database.js';

function Drifter({ tokenId }) {
    const drifter = useSelector(selectDrifter(tokenId));
    if (drifter) {
        const href = `/drifter/${tokenId}`;
        return (
            <div className="imgWrapper">
                <Link to={href}><img src={drifter.image} alt={drifter.name} /></Link>
                <span className="tokenId">{tokenId}</span>
            </div>
        );
    }
}

function RenderPage({ wallet }) {
    const tokenIds = useSelector(selectWalletDrifters(wallet));
    return (
        <div className="Crew">
            <div className="row wrap">
                {tokenIds.slice().reverse().map(tokenId => <Drifter key={tokenId} tokenId={tokenId} />)}
            </div>
        </div>
    );
}

export default function Crew() {
    const { wallet } = useParams();
    const onIsCorrect = () => {
        refreshWalletDrifters(wallet);
    };
    return (
        <Page onIsCorrect={onIsCorrect}>
            <RenderPage wallet={wallet} />
        </Page>
    );
}
