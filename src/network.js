import { ethers } from 'ethers';

export const NETWORK_PARAMS = {
    chainId: ethers.BigNumber.from(1).toHexString(),
    chainName: 'Ethereum',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io/']
};
