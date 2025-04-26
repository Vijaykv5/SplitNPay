"use client";

import { useUser } from "@civic/auth-web3/react";
import { LoginButton } from "./LoginButton";
import { UserProfile } from "./UserProfile";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const userContext = useUser();
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold text-white hover:text-slate-300">
          SplitNPay
        </Link>
        
        {/* Navigation links - only show when user is authenticated */}
        {userContext.user && (
          <div className="flex items-center space-x-4">
            <Link 
              href="/create-group" 
              className={`text-sm font-medium ${
                pathname === "/create-group" 
                  ? "text-emerald-400" 
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Create Group
            </Link>
            <Link 
              href="/groups" 
              className={`text-sm font-medium ${
                pathname === "/groups" 
                  ? "text-emerald-400" 
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              My Groups
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Show either login button or user profile based on auth state */}

      </div>
    </nav>
  );
} 