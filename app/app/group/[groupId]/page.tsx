"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useParams } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "../../components/NavBar";
import { Footer } from "../../components/Footer";
import { Progress } from "@/components/ui/progress";
import * as web3 from "@solana/web3.js";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useUser } from "@civic/auth-web3/react";
import Image from "next/image";

const GroupPage = () => {
  const { groupId } = useParams();
  const [groupData, setGroupData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const userContext = useUser();

  const fetchPayments = useCallback(async () => {
    if (!groupId) return;
    const { data, error } = await supabase
      .from("group_payments")
      .select("payer_address, amount_paid, paid_at")
      .eq("group_id", groupId)
      .order("paid_at", { ascending: false });
    if (!error) setPayments(data || []);
  }, [groupId]);

  const fetchGroupData = useCallback(async () => {
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
  }, [groupId]);

  useEffect(() => {
    fetchGroupData();
    fetchPayments();
  }, [fetchGroupData, fetchPayments]);

  const handlePayment = async () => {
    if (!userContext.user) {
      toast.error("Please sign in with Civic first.");
      return;
    }

    try {
      const paymentAmount = groupData?.split_amount;

      if (!paymentAmount || isNaN(paymentAmount)) {
        toast.error("Invalid payment amount. Please check group details.");
        return;
      }

      const lamports = Math.round(paymentAmount * web3.LAMPORTS_PER_SOL);

      // Get the wallet from Civic
      const wallet = (userContext as any).solana?.wallet;
      if (!wallet || !wallet.publicKey) {
        toast.error("Wallet not found. Please make sure you're connected with Civic.");
        return;
      }

      // Always use a web3.PublicKey instance
      const sender = new web3.PublicKey(wallet.publicKey);
      const recipient = groupData?.creator_public_key;

      if (!recipient) {
        toast.error("Group creator's wallet address is not configured.");
        return;
      }

      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );

      // Create transaction
      const transaction = new web3.Transaction();
      
      // Add transfer instruction
      transaction.add(
        web3.SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: new web3.PublicKey(recipient),
          lamports,
        })
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      
      // Set transaction properties
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sender;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      try {
        // Sign transaction
        const signedTransaction = await wallet.signTransaction(transaction);
        
        // Send transaction with proper options
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: "confirmed",
            maxRetries: 3
          }
        );

        // Wait for confirmation with proper options
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');

        if (confirmation.value.err) {
          throw new Error("Transaction failed to confirm");
        }

        // Insert payment record into group_payments
        await supabase
          .from("group_payments")
          .insert([
            {
              group_id: groupId,
              payer_address: sender.toString(),
              amount_paid: paymentAmount,
            },
          ]);

        const newAmountPaid = amountPaid + paymentAmount;
        const { error: updateError } = await supabase
          .from("groups")
          .update({ amount_paid: newAmountPaid })
          .eq("id", groupId);

        if (updateError) {
          console.error("Failed to update the database:", updateError);
          toast.error(`Payment successful, but failed to update the backend: ${updateError.message}`);
          return;
        }

        if (newAmountPaid >= groupData.total_amount) {
          const { error: statusError } = await supabase
            .from("groups")
            .update({ status: "closed" })
            .eq("id", groupId);

          if (statusError) {
            console.error("Failed to update the group status:", statusError);
            toast.error(`Payment successful, but failed to close the group: ${statusError.message}`);
          } else {
            toast.success("Group is now closed.");
          }
        }

        // Refresh group data and payments after successful update
        await fetchGroupData();
        await fetchPayments();
        
        toast.success(`Payment of ${paymentAmount} SOL successful!`);
      } catch (error) {
        console.error("Payment failed:", error);
        toast.error("Payment failed. Please try again.");
      }
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
                    <Image
                      src={groupData.group_photo}
                      alt="Group Photo"
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}

                  <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">Total Goal</p>
                        <p className="text-xl font-bold">
                          {groupData?.total_amount} SOL
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
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
                  <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">Amount Paid</p>
                        <p className="text-xl font-bold">{amountPaid} SOL</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold">Amount Remaining</p>
                        <p className="text-xl font-bold">
                          {groupData?.total_amount - amountPaid} SOL
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Payment History</h4>
                    {payments.length === 0 ? (
                      <p className="text-sm text-gray-500">No payments yet.</p>
                    ) : (
                      <ul className="text-sm divide-y">
                        {payments.map((p, i) => (
                          <li key={i} className="py-1 flex justify-between">
                            <span className="truncate max-w-[120px]" title={p.payer_address}>{p.payer_address.slice(0, 6)}...{p.payer_address.slice(-4)}</span>
                            <span>{p.amount_paid} SOL</span>
                            <span className="text-gray-400">{new Date(p.paid_at).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
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
        </main>
        <Footer />
        <Toaster />
      </ProtectedRoute>
    </>
  );
};

export default GroupPage;
