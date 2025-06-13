"use client";

import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { Check, Copy, LogOut, User, Wallet, ArrowUpRight, ExternalLink } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Image from "next/image";

export function UserProfile() {
  const userContext = useUser();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sanitizeImageUrl = (url: string): string | null => {
    try {
      new URL(url);
      if (url.includes('googleusercontent.com')) {
        let sanitized = url.split('=')[0];
        sanitized += '=s96-c';
        return sanitized;
      }
      return url;
    } catch (error) {
      console.warn("Invalid image URL:", url, error);
      return null;
    }
  };

  useEffect(() => {
    async function initializeWallet() {
      try {
        setIsLoading(true);
        
        if (!userContext.user) {
          return;
        }

        setImageError(false);
        setProfilePicture(null);

        let imageUrl: string | null = null;
        
        if (userContext.user?.image) {
          imageUrl = userContext.user.image as string;
        } else if ((userContext.user as any)?.picture) {
          imageUrl = (userContext.user as any).picture as string;
        } else if ((userContext.user as any)?.photos?.[0]?.value) {
          imageUrl = (userContext.user as any).photos[0].value as string;
        }
        
        if (imageUrl) {
          const sanitizedUrl = sanitizeImageUrl(imageUrl);
          if (sanitizedUrl) {
            setProfilePicture(sanitizedUrl);
          }
        }

        if (userHasWallet(userContext)) {
          if ((userContext as any).solana?.address) {
            setWalletAddress((userContext as any).solana.address);
            await fetchWalletBalance((userContext as any).solana.address);
          } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
            setWalletAddress((userContext as any).solana.wallet.publicKey.toString());
            await fetchWalletBalance((userContext as any).solana.wallet.publicKey);
          } else if ((userContext as any).publicKey?.toString()) {
            setWalletAddress((userContext as any).publicKey.toString());
            await fetchWalletBalance((userContext as any).publicKey);
          }
        } else if (userContext.createWallet) {
          try {
            setIsCreatingWallet(true);
            await userContext.createWallet();

            if ((userContext as any).solana?.address) {
              setWalletAddress((userContext as any).solana.address);
              await fetchWalletBalance((userContext as any).solana.address);
            } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
              setWalletAddress((userContext as any).solana.wallet.publicKey.toString());
              await fetchWalletBalance((userContext as any).solana.wallet.publicKey);
            } else if ((userContext as any).publicKey?.toString()) {
              setWalletAddress((userContext as any).publicKey.toString());
              await fetchWalletBalance((userContext as any).publicKey);
            }
          } catch (error) {
            console.error("Failed to create wallet:", error);
          } finally {
            setIsCreatingWallet(false);
          }
        }
      } catch (error) {
        console.error("Error in wallet initialization:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeWallet();
    
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [userContext]);

  const handleSignOut = async () => {
    try {
      setIsDropdownOpen(false);
      router.push('/');
      if ((userContext as any).signOut) {
        await (userContext as any).signOut();
      }
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const minifyAddress = (address: string | null): string => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const fetchWalletBalance = async (publicKey: any) => {
    if (!publicKey) return;

    try {
      setIsLoadingBalance(true);
      const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || "https://api.devnet.solana.com";
      console.log("Using RPC Endpoint:", rpcEndpoint);

      const connection = new Connection(rpcEndpoint);

      let solanaPublicKey;
      if (typeof publicKey === 'string') {
        solanaPublicKey = new PublicKey(publicKey);
      } else if (publicKey.toBase58) {
        solanaPublicKey = publicKey;
      } else if (publicKey.toString) {
        solanaPublicKey = new PublicKey(publicKey.toString());
      } else {
        console.error("Invalid public key format:", publicKey);
        throw new Error("Invalid public key format");
      }

      const balance = await connection.getBalance(solanaPublicKey);
      console.log("Fetched Balance:", balance);
      setWalletBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setWalletBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const renderProfilePicture = (size: 'sm' | 'lg') => {
    if (profilePicture && !imageError) {
      return (
        <Image 
          src={profilePicture} 
          alt="Profile" 
          width={size === 'sm' ? 40 : 48}
          height={size === 'sm' ? 40 : 48}
          className={`rounded-full object-cover ${size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'}`}
          onError={(e) => {
            const imgElement = e.currentTarget as HTMLImageElement;
            imgElement.onerror = null;
            setImageError(true);
            imgElement.classList.add('hidden');
          }}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      );
    } else {
      return (
        <div className={`flex items-center justify-center rounded-full 
          ${size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <User className={size === 'sm' ? 'h-5 w-5 text-slate-300' : 'h-6 w-6 text-slate-300'} />
        </div>
      );
    }
  };

  return (
    <div className="flex items-center gap-4 relative">
      {isLoading ? (
        <div className="flex items-center space-x-2 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse"></div>
          <div className="h-6 w-24 bg-slate-700 animate-pulse rounded"></div>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="rounded-full h-10 w-10 p-0  "
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ">
              {renderProfilePicture("sm")}
            </div>
          </Button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 rounded-lg bg-slate-800 border border-slate-700 shadow-lg z-50">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    {renderProfilePicture("lg")}
                  </div>
                  <div>
                    <p className="font-medium">
                      {userContext.user?.name || "Solana User"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Authenticated with Civic
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Authentication</span>
                    <span className="text-white flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Wallet</span>
                    {isCreatingWallet ? (
                      <span className="text-slate-300 text-xs">
                        Creating...
                      </span>
                    ) : walletAddress ? (
                      <span className="text-white flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Connected
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">
                        Not connected
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => router.push(`/profile/${walletAddress}`)}
                  >
                    My Profile
                  </Button>

                  {walletAddress && (
                    <div className="bg-slate-700/50 p-2 rounded flex items-center justify-between">
                      <div className="flex items-center">
                        <Wallet className="h-3 w-3 text-white mr-2" />
                        <span
                          className="text-xs font-mono text-slate-300"
                          title={walletAddress}
                        >
                          {minifyAddress(walletAddress)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a
                          href={`https://explorer.solana.com/address/${walletAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Solscan"
                          className="text-slate-400 hover:white transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={copyToClipboard}
                          title="Copy wallet address"
                        >
                          <Copy
                            className={`h-3 w-3 ${
                              isCopied ? "text-white" : "text-slate-400"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  )}

                 
                </div>

                <div className="pt-3 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      
    </div>
  );
} 