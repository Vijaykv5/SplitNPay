import type { Metadata } from "next";

import "./globals.css";
import { Wallet } from "./components/Wallet";

export const metadata: Metadata = {
  title: "SplitNPay",
  description: "Make your onchain payment easier and faster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Wallet>{children}</Wallet>
      </body>
    </html>
  );
}
