"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/walletContext";
import { Toaster, toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isWalletConnected, loading } = useWallet();
  const router = useRouter();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!isWalletConnected && !loading && !toastShown.current) {
      toast("Please connect your wallet", {
        description: "You need to connect your wallet to access this page.",
        action: {
          label: "Connect",
          onClick: () => console.log("Connect wallet"),
        },
      });
      toastShown.current = true;
      router.push("/");
    }
  }, [isWalletConnected, loading, router]);

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "white",
            color: "black",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          className: "rounded-md",
        }}
      />
    </>
  );
};

export default ProtectedRoute;
