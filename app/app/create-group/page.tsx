"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "../components/NavBar";
import { ImageUpload } from "../components/ImageUpload";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@civic/auth-web3/react";
import { toast } from "sonner";
import { userHasWallet } from "@civic/auth-web3";
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { UserProfile } from "@/components/UserProfile";
import Image from "next/image";

interface SolanaUser {
  solana?: {
    address: string;
  };
}

export default function CreateGroupPage() {
  const { publicKey: walletPublicKey } = useWallet();
  const userContext = useUser();
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);
  const [groupDescription, setGroupDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [splitAmount, setSplitAmount] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getWalletAddress() {
      if (!userContext) return;
      let address = null;
      if (userHasWallet(userContext)) {
        if ((userContext as any).solana?.address) {
          address = (userContext as any).solana.address;
        } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
          address = (userContext as any).solana.wallet.publicKey.toString();
        } else if ((userContext as any).publicKey?.toString()) {
          address = (userContext as any).publicKey.toString();
        }
      } else if (userContext.createWallet) {
        await userContext.createWallet();
        if ((userContext as any).solana?.address) {
          address = (userContext as any).solana.address;
        } else if ((userContext as any).solana?.wallet?.publicKey?.toString()) {
          address = (userContext as any).solana.wallet.publicKey.toString();
        } else if ((userContext as any).publicKey?.toString()) {
          address = (userContext as any).publicKey.toString();
        }
      }
      setPublicKey(address);
      setLoading(false);
    }
    getWalletAddress();
  }, [userContext]);

  const handlePhotoUpload = (imageUrl: string) => {
    setGroupPhoto(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("No public key found. Please make sure you're signed in.");
      return;
    }

    try {
      // Create Solana connection
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      
      // Get the wallet from Civic
      const wallet = (userContext as any).solana?.wallet;
      if (!wallet) {
        toast.error("Wallet not found. Please make sure you're connected with Civic.");
        return;
      }

      // Calculate lamports
      const totalAmountInSol = parseFloat(totalAmount);
      if (isNaN(totalAmountInSol) || totalAmountInSol <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      const lamports = Math.round(totalAmountInSol * LAMPORTS_PER_SOL);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(publicKey), // For now, sending to self as a test
          lamports,
        })
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(publicKey);

      try {
        // Sign and send transaction
        const signedTransaction = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        
        // Wait for confirmation with timeout
        const confirmation = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');

        if (confirmation.value.err) {
          throw new Error('Transaction failed');
        }
        
        toast.success("Transaction successful!");

        // Proceed with group creation
        const groupData = {
          publicKey,
          creator_public_key: publicKey,
          groupName,
          groupPhoto,
          groupDescription,
          totalAmount: totalAmountInSol,
          numberOfPeople: parseInt(numberOfPeople, 10),
          splitAmount,
          transactionSignature: signature // Store the transaction signature
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
        } else {
          toast.error("Failed to create group");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        toast.error("Transaction failed. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing transaction or creating group");
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

  const resetForm = () => {
    setGroupName("");
    setGroupPhoto(null);
    setGroupDescription("");
    setTotalAmount("");
    setNumberOfPeople("");
    setSplitAmount(null);
    setGroupId(null);
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-[#F8F8FF]">
        <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl" />
        <div className="flex justify-between items-center px-4 py-2">
          <SiteHeader />
          <UserProfile />
        </div>
        <main className="relative pt-20 flex-grow">
          <motion.div
            className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">
                Create a Group
              </h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">Group Name</Label>
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Trip to NYC"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupPhoto" className="text-sm font-medium text-gray-700">Group Photo (Optional)</Label>
                  <ImageUpload onUpload={handlePhotoUpload} />
                  {groupPhoto && (
                    <Image
                      src={groupPhoto}
                      alt="Group Photo"
                      width={400}
                      height={300}
                      className="mt-2 rounded-lg max-w-full h-auto object-cover"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupDescription" className="text-sm font-medium text-gray-700">Group Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Describe the purpose of this group"
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount" className="text-sm font-medium text-gray-700">Total Amount</Label>
                    <div className="relative">
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
                        <span className="text-gray-500 text-sm">SOL</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople" className="text-sm font-medium text-gray-700">Number of People</Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                      placeholder="Enter number of people"
                      required
                    />
                  </div>
                </div>
                {splitAmount !== null && (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      Split Amount: {splitAmount.toFixed(2)} SOL per person
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#14153F] text-white rounded-lg py-3 text-base font-medium hover:bg-[#14153F]/90 transition-colors mt-6"
                >
                  Create Group
                </Button>
              </form>
            </div>
          </motion.div>
        </main>

        {/* Modal for shareable URL */}
        {showModal && groupId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Group Created!</h3>
              <p className="text-gray-600 mb-4">Your group has been created. Share the link below:</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <a
                  href={`/group/${groupId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 break-all"
                >
                  {window.location.origin}/group/{groupId}
                </a>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200"
                  onClick={resetForm}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    // </ProtectedRoute>
  );
}
