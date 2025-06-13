import type { Metadata } from "next";

import "./globals.css";
import { Wallet } from "./components/Wallet";
import { CivicAuthProvider } from "@civic/auth-web3/react";

export const metadata: Metadata = {
  title: "SplitNPay",
  description: "Simplifying group payments on solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CivicAuthProvider clientId={process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID || ""}>
          <Wallet>{children}</Wallet>
        </CivicAuthProvider>
      </body>
    </html>
  );
}
