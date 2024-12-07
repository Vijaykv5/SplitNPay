"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "./components/NavBar";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { Footer } from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatAnimation } from "./components/ChatAnimation";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden bg-[#F8F8FF]">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />

        <SiteHeader />

        {/* Hero Section */}
        <main className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#FFF5F6] via-[#F5B0CA] to-[#C5A6E5]">
            <div className="grid lg:grid-cols-2 min-h-[calc(100vh-9rem)]">
              {/* Left Content */}
              <motion.div
                className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  Buy now, <br />
                  pay together.
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg text-gray-800 mb-12 max-w-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                  Antic secure group pay solution lets your customers invite
                  friends to your platform for joint payments, reducing
                  acquisition costs and boosting conversion.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                >
                  <Link href="/create-group">
                    <Button className="bg-[#14153F] text-white rounded-full px-8 py-6 text-base hover:bg-[#14153F]/90 transition-colors">
                      Create Group
                    </Button>
                  </Link>
                  <Link href="/join-group">
                    <Button className="bg-[#14153F] text-white rounded-full px-8 py-6 text-base hover:bg-[#14153F]/90 transition-colors">
                      Join Group
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Content - Chat Animation */}
              <motion.div
                className="p-8 sm:p-16 lg:p-24 flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <ChatAnimation />
              </motion.div>
            </div>
          </div>

          {/* How it Works Section */}
          <motion.div
            id="how-it-works"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 rounded-[2rem] bg-[#14153F] text-white overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-16 lg:p-24">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-300">
                  How it works
                </h2>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
                  Increase conversions,
                  <br />
                  lower your CAC
                </h2>
                <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-xl">
                  Your customers purchase high ticket items in groups. With
                  Antic, they can invite their friends to your platform and pay
                  for these items together.
                </p>
                <ul className="space-y-4">
                  {[
                    "Lower your acquisition costs.",
                    "Increase retention.",
                    "Get valuable data about every person who contributed to the payment.",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <div className="rounded-full bg-green-400/10 p-1">
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right Content - Payment UI */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <div className="bg-gray-100 rounded-xl p-8 text-black">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="rounded-full bg-green-400 p-2">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        Your payment was received
                      </h3>
                      <p className="text-gray-600">
                        You'll only be charged when the group reaches full
                        payment status.
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="font-medium">
                      Le Val Thrones, a Beaumier hotel
                    </p>
                    <div className="flex justify-between mt-2">
                      <span>Total</span>
                      <span className="font-semibold">$250</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <p className="text-center mb-4">
                      Invite more people to join this group.
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 truncate">
                        https://www.vacations...
                      </div>
                      <Button variant="default" className="bg-[#14153F] gap-2">
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Integration Section */}
            <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-16 lg:p-24 bg-[#1A1B45]">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Get up and running fast
                </h2>
                <p className="text-lg sm:text-xl text-gray-300">
                  Easily integrate Antic into your checkout flow. Simply
                  onboard, connect the widget and you're good to go.
                </p>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-400/10 p-1">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                  Pay as a group with a click of a button
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="bg-[#14153F] rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <pre className="text-gray-300 overflow-x-auto">
                    <code>{`import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Antic, { PartnerData, GroupData } from 'antic-sdk';

const Host = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupData, setGroupData] = useState<GroupData>();

  return (
    // Your implementation here
  );
};`}</code>
                  </pre>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
