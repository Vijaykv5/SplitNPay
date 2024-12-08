"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useParams } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { Progress } from "@/components/ui/progress";
import * as web3 from "@solana/web3.js";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const GroupPage = () => {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId)
          .single();

        if (error) {
          setError("Error fetching group data");
          toast.error(error.message);
        } else {
          setGroupData(data);
          setAmountPaid(data.amount_paid || 0);
        }
      } catch (error) {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handlePayment = async () => {
    if (!window.solana) {
      toast.error("Wallet not connected. Please connect your Solana wallet.");
      return;
    }

    try {
      const paymentAmount = groupData?.split_amount;

      if (!paymentAmount || isNaN(paymentAmount)) {
        toast.error("Invalid payment amount. Please check group details.");
        return;
      }

      // Convert SOL to lamports and ensure it's an integer
      const lamports = Math.round(paymentAmount * web3.LAMPORTS_PER_SOL);

      const provider = window.solana;
      const sender = provider.publicKey;
      const recipient = groupData?.public_key;

      if (!recipient) {
        toast.error("Recipient wallet address is not configured.");
        return;
      }

      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );

      // Create and sign the transaction
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: new web3.PublicKey(recipient),
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sender;

      const signedTransaction = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction(signature, "confirmed");

      const newAmountPaid = amountPaid + paymentAmount;
      const { error } = await supabase
        .from("groups")
        .update({ amount_paid: newAmountPaid })
        .eq("id", groupId);

      if (error) {
        console.error("Failed to update the database:", error);
        toast.error("Payment successful, but failed to update the backend.");
        return;
      }

      if (newAmountPaid >= groupData.total_amount) {
        const { error: statusError } = await supabase
          .from("groups")
          .update({ status: "closed" })
          .eq("id", groupId);

        if (statusError) {
          console.error("Failed to update the group status:", statusError);
          toast.error("Payment successful, but failed to close the group.");
        } else {
          toast.success("Group is now closed.");
        }
      }

      setAmountPaid(newAmountPaid);
      setGroupData({ ...groupData, amount_paid: newAmountPaid });

      toast.success(`Payment of ${paymentAmount} SOL successful!`);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const progressPercentage = (amountPaid / groupData?.total_amount) * 100 || 0;
  const isClosed = groupData?.status === "closed" || progressPercentage === 100;

  return (
    <>
      <ProtectedRoute>
        <SiteHeader />
        <main className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-28">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#14153F] text-white p-6 text-center">
                <h1 className="text-4xl font-bold">
                  {groupData?.group_name || "Group Name"}
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="space-y-8">
                  {groupData?.group_photo && (
                    <img
                      src={groupData.group_photo}
                      alt="Group Photo"
                      className="rounded-lg shadow-lg mb-6 w-full max-h-80 object-cover"
                    />
                  )}

                  <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-[#14153F] w-6 h-6" />
                      <div>
                        <p className="font-semibold">Total Goal</p>
                        <p className="text-xl font-bold">
                          {groupData?.total_amount} SOL
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-[#14153F] w-6 h-6" />
                      <div>
                        <p className="font-semibold">Number of People</p>
                        <p className="text-xl font-bold">
                          {groupData?.number_of_people}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-100 rounded-lg p-6 mb-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-[#14153F] w-6 h-6" />
                      <div>
                        <p className="font-semibold">Amount Paid</p>
                        <p className="text-xl font-bold">{amountPaid} SOL</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-[#14153F] w-6 h-6" />
                      <div>
                        <p className="font-semibold">Amount Remaining</p>
                        <p className="text-xl font-bold">
                          {groupData?.total_amount - amountPaid} SOL
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#14153F] mb-3">
                      Progress
                    </h3>
                    <Progress
                      value={progressPercentage}
                      className={`h-3 ${
                        progressPercentage === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } transition-all`}
                    />
                    <p className="text-sm text-gray-600 mt-2 text-right">
                      {progressPercentage.toFixed(2)}% Complete
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[#14153F] mb-3">
                      Description
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {groupData?.group_description ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-[#14153F] text-white rounded-full py-4 text-lg hover:bg-[#14153F]/90 transition-all"
                      disabled={isClosed}
                    >
                      {isClosed
                        ? "Group Closed"
                        : `Pay ${groupData?.split_amount || 0} SOL`}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <Toaster />
      </ProtectedRoute>
    </>
  );
};

export default GroupPage;
