"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { ImageUpload } from "../components/ImageUpload";
import ProtectedRoute from "../components/ProtectedRoute";
import { useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { toast } from "sonner";

export default function CreateGroupPage() {
  const { publicKey, signTransaction } = useWallet();
  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
  const [groupDescription, setGroupDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [splitAmount, setSplitAmount] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fields, setFields] = useState([]);

  const handlePhotoUpload = (imageUrl: string) => {
    setGroupPhoto(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!splitAmount) {
      toast.error("Please enter valid total amount and number of people");
      return;
    }

    if (isProcessing) {
      toast.error("Transaction is already being processed");
      return;
    }

    setIsProcessing(true);

    try {
      // Create connection to Solana network
      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );

      // Convert split amount to lamports (amount per person)
      const lamports = Math.round(splitAmount * web3.LAMPORTS_PER_SOL);

      // Create transaction
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new web3.PublicKey("95KBgcZxuVyoxjvmrrbm7Hv2s85ChajcWN6HtAWZk9DL"), // Your program's wallet address
          lamports,
        })
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      try {
        // Send transaction
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize(),
          { skipPreflight: true } // Skip preflight to avoid simulation errors
        );

        // Wait for confirmation with timeout
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, "confirmed");

        if (confirmation.value.err) {
          throw new Error("Transaction failed to confirm");
        }

        // If transaction is successful, create the group
        const groupData = {
          publicKey: publicKey.toString(),
          groupName,
          groupPhoto,
          groupDescription,
          totalAmount: parseFloat(totalAmount),
          numberOfPeople: parseInt(numberOfPeople, 10),
          splitAmount,
          amountPaid: splitAmount, // Add the initial payment amount
        };

        const response = await fetch("/api/create-group", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(groupData),
        });

        if (response.ok) {
          const { groupId } = await response.json();
          setGroupId(groupId);
          setShowModal(true);
          toast.success(`Group created successfully! Paid ${splitAmount} SOL`);
          
          
          setGroupName("");
          setGroupPhoto(null);
          setGroupDescription("");
          setTotalAmount("");
          setNumberOfPeople("");
          setSplitAmount(null);
          setFields([]);
        } else {
          toast.error("Failed to create group");
        }
      } catch (error: any) {
        if (error.name === 'SendTransactionError') {
          // Get detailed error logs
          const logs = error.logs || [];
          console.error('Transaction failed with logs:', logs);
          
          if (logs.includes('This transaction has already been processed')) {
            toast.error("This transaction has already been processed. Please try creating a new group.");
          } else {
            toast.error(`Transaction failed: ${error.message}`);
          }
        } else {
          toast.error(`Transaction failed: ${error.message}`);
        }
        throw error; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to create group. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (totalAmount && numberOfPeople) {
      const total = parseFloat(totalAmount);
      const people = parseInt(numberOfPeople, 10);
      if (!isNaN(total) && !isNaN(people) && people > 0) {
        setSplitAmount(total / people);
      } else {
        setSplitAmount(null);
      }
    } else {
      setSplitAmount(null);
    }
  }, [totalAmount, numberOfPeople]);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen overflow-hidden bg-[#F8F8FF]">
        <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
        <SiteHeader />
        <main className="relative pt-32">
          <motion.div
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-white rounded-[2rem] shadow-xl p-8">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Create a Group
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Trip to NYC"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupPhoto">Group Photo (Optional)</Label>
                  <ImageUpload onUpload={handlePhotoUpload} />
                  {groupPhoto && (
                    <img
                      src={groupPhoto}
                      alt="Group Photo"
                      className="mt-2 rounded-md max-w-full h-auto"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="groupDescription">Group Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Describe the purpose of this group"
                    required
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <Input
                      id="totalAmount"
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="Enter total amount"
                      required
                      className="pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">SOL</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="numberOfPeople">Number of People</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    placeholder="Enter number of people"
                    required
                  />
                </div>
                {splitAmount !== null && (
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">
                      Split Amount: {splitAmount.toFixed(2)} SOL per person
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#14153F] text-white rounded-full py-6 text-base hover:bg-[#14153F]/90 transition-colors"
                >
                  Create Group
                </Button>
              </form>
            </div>
          </motion.div>
        </main>

        {/* Modal for shareable URL */}
        {showModal && groupId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Group Created!</h3>
              <p>Your group has been created. Share the link below:</p>
              <p className="mt-2 font-semibold text-blue-500">
                <a
                  href={`/group/${groupId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {window.location.origin}/group/{groupId}
                </a>
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
