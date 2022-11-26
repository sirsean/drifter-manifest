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
    store,
    selectWalletDrifters,
    selectDrifter,
    setAttributeFilter,
    selectAttributeFilter,
} from '../database.js';

function matchAttributeFilter(drifter, attributeFilter) {
    if (!attributeFilter) {
        return true;
    }
    const re = new RegExp(attributeFilter, 'i');
    if (re.exec(drifter.tokenId.toString()) != null) {
        return true;
    }
    return drifter.attributes.map(a => a.value).some(value => {
        return (re.exec(value) != null);
    });
}

function Drifter({ tokenId }) {
    const drifter = useSelector(selectDrifter(tokenId));
    const attributeFilter = useSelector(selectAttributeFilter);
    if (drifter && matchAttributeFilter(drifter, attributeFilter)) {
        const href = `/drifter/${tokenId}`;
        const fastImage = `https://nfts-dataw.s3.amazonaws.com/fringe-images/${tokenId}.png`;
        const onError = (e) => {
            e.target.onError = null;
            e.target.src = drifter.image;
        };
        return (
            <div className="imgWrapper">
                <Link to={href}>
                    <img src={fastImage} alt={drifter.name} onError={onError} />
                </Link>
                <span className="tokenId">{tokenId}</span>
            </div>
        );
    }
}

function AttributeFilter() {
    const attributeFilter = useSelector(selectAttributeFilter);
    const onChange = (e) => {
        const attr = e.target.value;
        store.dispatch(setAttributeFilter(attr));
    };
    return (
        <div className="AttributeFilter">
            <input type="text" defaultValue={attributeFilter} onChange={onChange} tabIndex="1" />
        </div>
    );
}

function CrewList({ wallet }) {
    const tokenIds = useSelector(selectWalletDrifters(wallet));
    return (
        <div className="row wrap">
            {tokenIds.slice().reverse().map(tokenId => <Drifter key={tokenId} tokenId={tokenId} />)}
        </div>
    );
}

function RenderPage({ wallet }) {
    return (
        <div className="Crew">
            <AttributeFilter />
            <CrewList wallet={wallet} />
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
