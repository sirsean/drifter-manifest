import { ethers } from 'ethers';
import { getProvider, loadContract } from './wallet.js';
import {
    store,
    setDrifter,
    setWalletDrifterByIndex,
    trimWalletDrifters,
    persistStorage,
} from './database.js';
import FringeDriftersContractABI from './abi/FringeDriftersContract.js';

const FRINGE_DRIFTERS_CONTRACT_ADDRESS = '0xe3B399AAb015D2C0D787ECAd40410D88f4f4cA50';

function drifterContract() {
    return loadContract(FRINGE_DRIFTERS_CONTRACT_ADDRESS, FringeDriftersContractABI);
}

export async function balanceOf(address) {
    return drifterContract().balanceOf(address).then(balance => balance.toNumber());
}

export async function tokenOfOwnerByIndex(address, index) {
    return drifterContract().tokenOfOwnerByIndex(address, index).then(tokenId => tokenId.toNumber());
}

export async function fetchMetadata(tokenId) {
    return fetch(`https://omniscient.fringedrifters.com/main/metadata/${tokenId}.json`)
        .then(r => r.json())
        .then(metadata => {
            return { tokenId, ...metadata };
        });
}

export async function tokenIdsByOwner(address) {
    let tokenIds = [];
    const balance = await balanceOf(address);
    for (let i=balance-1; i >= 0; i--) {
        try {
            const tokenId = await tokenOfOwnerByIndex(address, i);
            store.dispatch(setWalletDrifterByIndex({
                wallet: address,
                index: i,
                tokenId: tokenId,
            }));
            const state = store.getState();
            if (!state.driftersById[tokenId]) {
                const drifter = await fetchMetadata(tokenId);
                store.dispatch(setDrifter(drifter));
            }
            tokenIds.push(tokenId);
        } catch (e) {
            console.error('failed to load index', i);
        }
    }
    store.dispatch(trimWalletDrifters({
        wallet: address,
        length: tokenIds.length,
    }));
    persistStorage();
}
