"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "./components/NavBar";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { Footer } from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatAnimation } from "./components/ChatAnimation";
import { useState } from "react";
import { supabase } from "./utils/supabaseClient";
import { toast } from "sonner";
import { useUser } from "@civic/auth/react";
import { Connection } from "@solana/web3.js";


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const { user } = useUser();

  const handleJoinGroup = async () => {
    setModalError(null);

    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", joinGroupId)
      .single();

    if (error || !data) {
      setModalError("Invalid group ID.");
    } else {
      toast.success("Successfully joined the group!");
      window.location.href = `/group/${joinGroupId}`;
      setIsModalOpen(false);
    }
  };

  const connection = new Connection("https://api.devnet.solana.com");


  return (
    <>
      <ProtectedRoute>
        <div className="relative min-h-screen overflow-hidden bg-[#F8F8FF]">
          <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
          <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
          <SiteHeader />

          <main className="relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#FFF5F6] via-[#F5B0CA] to-[#C5A6E5]">
              <div className="grid lg:grid-cols-2 min-h-[calc(100vh-9rem)]">
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
                    Buy Now <br />
                    Pay Together.
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg text-gray-800 mb-12 max-w-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  >
                    SplitNPay simplifies group payments for your customers,
                    making joint payments easy and secure while lowering
                    acquisition costs and boosting conversion rates.
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
                    <Button
                      className="bg-[#14153F] text-white rounded-full px-8 py-6 text-base hover:bg-[#14153F]/90 transition-colors"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Join Group
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Chat Animation */}
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

            <motion.div
              id="how-it-works"
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-16 rounded-[2rem] bg-[#14153F] text-white overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-16 lg:p-24">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-300">
                    How PayTogether works
                  </h2>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
                    Simplify Group <br />
                    Payments.
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-xl">
                    The organizer creates a new payment request within the
                    SplitNPay app, specifying the total amount, the purpose
                    (e.g., a dinner bill), and the participants.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Manage your trip expenses with ease.",
                      "Invite friends to join your payment group.",
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
                          Payment Received
                        </h3>
                        <p className="text-gray-600">
                          All the amount will be credited to the organizers
                          account once the payment is completed.
                        </p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="font-medium">Trip to Banglore</p>
                      <div className="flex justify-between mt-2">
                        <span>Total</span>
                        <span className="font-semibold">0.8 Sol</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6">
                      <p className="text-center mb-4">
                        Invite others to join your payment group.
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 truncate">
                          https://splitnpay...
                        </div>
                        <Button variant="default" className="bg-[white] gap-2">
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </main>
          <Footer />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4">Join Group</h2>
              <input
                type="text"
                placeholder="Enter Group ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                value={joinGroupId}
                onChange={(e) => setJoinGroupId(e.target.value)}
              />
              {modalError && (
                <p className="text-red-500 text-sm mb-4">{modalError}</p>
              )}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleJoinGroup}
                >
                  Join
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-100 text-emerald-600 border-emerald-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </ProtectedRoute>
    </>
  );
}
