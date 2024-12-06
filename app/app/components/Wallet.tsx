// components/Wallet.tsx
"use client";

import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  AlphaWalletAdapter,
  LedgerWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { FC, useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "../context/walletContext"; // Import WalletContextProvider

type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }) => {
  const endpoint = "https://api-devnet.helius.xyz"; // RPC endpoint

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new AlphaWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
