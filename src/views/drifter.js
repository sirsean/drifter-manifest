import React from 'react';
import { useSelector } from 'react-redux';
import {
    useParams,
} from 'react-router-dom';
import { Page } from './layout.js';
import {
    fetchMetadata,
} from '../client.js';
import {
    store,
    setDrifter,
    selectDrifter,
} from '../database.js';

function Attribute({ attr }) {
    const { trait_type, value } = attr;
    return (
        <div className="Attribute">
            <span className="Trait">{trait_type}</span>
            <span className="Value">{value}</span>
        </div>
    );
}

function RenderPage({ tokenId }) {
    const drifter = useSelector(selectDrifter(tokenId));
    if (drifter) {
        const openseaHref = `https://opensea.io/assets/ethereum/0xe3b399aab015d2c0d787ecad40410d88f4f4ca50/${tokenId}`;
        return (
            <div className="Drifter">
                <h2>{drifter.name}</h2>
                <div className="row">
                    <div className="col">
                        <div className="DrifterImage">
                            <img src={drifter.image} alt={drifter.name} />
                        </div>
                        <div className="links">
                            <a href={openseaHref} target="_blank" rel="noreferrer">opensea</a>
                        </div>
                    </div>
                    <div className="col">
                        {drifter.attributes.map((attr, i) => <Attribute key={i} attr={attr} />)}
                    </div>
                </div>
            </div>
        );
    }
}

export default function Drifter() {
    const { tokenId } = useParams();
    const onIsCorrect = () => {
        fetchMetadata(tokenId).then(drifter => store.dispatch(setDrifter(drifter)));
    };
    return (
        <Page onIsCorrect={onIsCorrect}>
            <RenderPage tokenId={tokenId} />
        </Page>
    );
}
