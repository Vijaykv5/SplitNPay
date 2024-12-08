"use client";

import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "../components/NavBar";

const SupportPage = () => {
  const walletAddress = "95KBgcZxuVyoxjvmrrbm7Hv2s85ChajcWN6HtAWZk9DL";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <SiteHeader />
      <div className="text-center py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Support the Developer
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          If you enjoy this project, consider donating 0.01 SOL to support the
          developer. Every little bit helps!
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-xl text-gray-800 font-semibold mb-2">
            Donate to this wallet address:
          </p>
          <p className="text-sm text-gray-600 mb-4 break-words">
            {walletAddress}
          </p>
          <Button
            onClick={handleCopyAddress}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-6 rounded-lg"
          >
            Copy Address
          </Button>
        </div>

        <p className="text-lg text-gray-600">
          Please send 0.01 SOL to this address to support the developer. Thank
          you!
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default SupportPage;
