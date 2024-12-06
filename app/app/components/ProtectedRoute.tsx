'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/walletContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isWalletConnected, loading } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isWalletConnected) {
      router.push("/"); // Redirect only after loading is complete
    }
  }, [isWalletConnected, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while determining connection status
  }

  

  return <>{children}</>;
};

export default ProtectedRoute;
