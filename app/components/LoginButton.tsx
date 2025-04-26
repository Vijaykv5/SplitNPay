"use client";

import { useUser } from "@civic/auth-web3/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const userContext = useUser();

  const handleLogin = async () => {
    try {
      // This will trigger the Civic authentication flow
      if (userContext.signIn) {
        await userContext.signIn();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
      onClick={handleLogin}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  );
} 