import { createSlice, configureStore } from '@reduxjs/toolkit';

function loadLocalStorage(key, defaultValue) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
}

const slice = createSlice({
    name: 'drifter-manifest',
    initialState: {
        hasWallet: false,
        isCorrectChain: false,
        address: null,
        driftersById: loadLocalStorage('driftersById', {}), // {tokenId => metadata}
        walletDriftersByIndex: loadLocalStorage('walletDriftersByIndex', {}), // {wallet => [tokenId]}
    },
    reducers: {
        setHasWallet: (state, action) => {
            state.hasWallet = action.payload;
        },
        setIsCorrectChain: (state, action) => {
            state.isCorrectChain = action.payload;
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setDrifter: (state, action) => {
            state.driftersById[action.payload.tokenId] = action.payload;
        },
        setWalletDrifterByIndex: (state, action) => {
            const { wallet, index, tokenId } = action.payload;
            if (!state.walletDriftersByIndex[wallet]) {
                state.walletDriftersByIndex[wallet] = [];
            }
            state.walletDriftersByIndex[wallet][index] = tokenId;
        },
        trimWalletDrifters: (state, action) => {
            const { wallet, length } = action.payload;
            if (!state.walletDriftersByIndex[wallet]) {
                state.walletDriftersByIndex[wallet] = [];
            }
            state.walletDriftersByIndex[wallet] = state.walletDriftersByIndex[wallet].slice(0, length);
        },
    },
});

export const setHasWallet = slice.actions.setHasWallet;
export const setIsCorrectChain = slice.actions.setIsCorrectChain;
export const setAddress = slice.actions.setAddress;
export const setDrifter = slice.actions.setDrifter;
export const setWalletDrifterByIndex = slice.actions.setWalletDrifterByIndex;
export const trimWalletDrifters = slice.actions.trimWalletDrifters;

export const store = configureStore({
    reducer: slice.reducer,
});

export function persistStorage() {
    const state = store.getState();
    localStorage.setItem('driftersById', JSON.stringify(state.driftersById));
    localStorage.setItem('walletDriftersByIndex', JSON.stringify(state.walletDriftersByIndex));
}

export const selectHasWallet = state => state.hasWallet;
export const selectIsCorrectChain = state => state.isCorrectChain;
export const selectAddress = state => state.address;
export const selectDrifter = tokenId => state => state.driftersById[tokenId];
export const selectWalletDrifters = wallet => state => (state.walletDriftersByIndex[wallet] || []);
