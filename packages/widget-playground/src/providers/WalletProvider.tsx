import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  coinbase,
  dcent,
  exodus,
  frame,
  frontier,
  gate,
  hyperpay,
  imtoken,
  liquality,
  okx,
  oneinch,
  ownbit,
  rabby,
  safe,
  safepal,
  status,
  taho,
  tokenary,
  tokenpocket,
  trust,
  walletConnect,
  xdefi,
} from '@lifi/wallet-management';
import { formatChain, useAvailableChains } from '@lifi/widget';
import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const connectors = [
  walletConnect,
  coinbase,
  bitget,
  gate,
  exodus,
  taho,
  safe,
  binance,
  frontier,
  okx,
  trust,
  status,
  alpha,
  block,
  bitpie,
  brave,
  dcent,
  frame,
  hyperpay,
  imtoken,
  liquality,
  ownbit,
  tokenpocket,
  xdefi,
  oneinch,
  tokenary,
  safepal,
  rabby,
];

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    // Add ENS contracts
    const _mainnet = _chains.find((chain) => chain.id === mainnet.id);
    if (_mainnet) {
      _mainnet.contracts = mainnet.contracts;
    }
    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: connectors,
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
    });

    return wagmiConfig;
  }, [chains]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      {children}
    </WagmiProvider>
  );
};
