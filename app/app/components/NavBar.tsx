"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import "./wallet-adapter.css"; 

export function SiteHeader() {
  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {

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

  const handleWalletClick = () => {
    if (publicKey) {
      ///profile/u/{publicKey}
      router.push(`/profile/${publicKey.toString()}`);
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
                href="/support"
                className="text-sm hover:opacity-70 transition-opacity"
              >
                Support
              </Link>

            
              {walletAddress ? (
                <div
                  className="flex items-center space-x-2 bg-black text-white rounded-full px-4 py-2 cursor-pointer"
                  onClick={handleWalletClick}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZi7OIPEnSno1cZkt5t6MnrSk1AEXTIjwJqg&s" // Placeholder for wallet avatar
                    alt="Wallet Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{walletAddress}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click event from propagating to the parent div
                      disconnect();
                    }}
                    className="text-sm hover:opacity-70 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ) : (
                <WalletMultiButton className="bg-[#14153F] text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-[#14153F]/90 transition-colors" />
              )}
            </nav>

           
            <button className="sm:hidden">
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
