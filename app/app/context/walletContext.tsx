import React, { createContext, useContext, useState, useEffect } from "react"; 
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"; 

interface WalletContextType { 
  isWalletConnected: any; 
  loading: boolean; 
  setIsWalletConnected: any; 
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => { 
  const context = useContext(WalletContext); 
  if (!context) { 
    throw new Error("useWallet must be used within a WalletProvider"); 
  } 
  return context; 
};

interface WalletContextProviderProps { 
  children: React.ReactNode; 
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => { 
  const { connected, disconnect } = useSolanaWallet(); 
  const [isWalletConnected, setIsWalletConnected] = useState(localStorage.getItem("walletName") || false); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => { 
    if (connected) { 
      setIsWalletConnected(true); 
      localStorage.setItem("walletConnected", "true"); 
    } else { 
      setIsWalletConnected(false); 
      localStorage.setItem("walletConnected", "false"); 
    } 
    setLoading(false); 
  }, [connected]);

  return ( 
    <WalletContext.Provider value={{ isWalletConnected, setIsWalletConnected, loading }}>
      {children} 
    </WalletContext.Provider> 
  ); 
};
