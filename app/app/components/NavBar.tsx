"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import "./wallet-adapter.css"; // Import custom styles for WalletMultiButton

export function SiteHeader() {

  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      // Set the wallet address in a truncated format
      const address = `${publicKey.toString().slice(0, 6)}...${publicKey
        .toString()
        .slice(-4)}`;
      setWalletAddress(address);
    } else {
      setWalletAddress(null);
    }
  }, [publicKey]);

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-4">
        <div className="bg-white/50 backdrop-blur-xl backdrop-saturate-150 rounded-2xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
                S&P
            </Link>

            <nav className="hidden sm:flex items-center space-x-8">
              <button
                onClick={scrollToHowItWorks}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                How it works?
              </button>
              <Link
                href="/about"
                className="text-sm hover:opacity-70 transition-opacity"
              >
                About
              </Link>

              {/* Show the connected wallet UI if a wallet is connected */}
              {walletAddress ? (
                <div className="flex items-center space-x-2 bg-black text-white rounded-full px-4 py-2">
                  <img
                    src="https://via.placeholder.com/30" // Placeholder for wallet avatar
                    alt="Wallet Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{walletAddress}</span>
                  <button
                    onClick={disconnect}
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ) : (
                <WalletMultiButton className="bg-[#14153F] text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-[#14153F]/90 transition-colors" />
              )}
            </nav>

            {/* Mobile menu button */}
            <button className="sm:hidden">
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
