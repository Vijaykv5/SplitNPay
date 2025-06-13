"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import "./wallet-adapter.css";
import { UserButton } from "@civic/auth-web3/react";
import { UserProfile } from "../../components/UserProfile";
import { useUser } from "@civic/auth-web3/react";

export function SiteHeader() {
  const userContext = useUser();
  const router = useRouter();
  const { publicKey } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (userContext.user) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
    setIsLoading(false);
  }, [userContext.user]);

  useEffect(() => {
    if (publicKey) {
      const address = `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`;
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

              <div className="flex items-center cursor-pointer">
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                ) : isUserLoggedIn ? (
                  <UserProfile />
                ) : (
                  <UserButton />
                )}
              </div>
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
