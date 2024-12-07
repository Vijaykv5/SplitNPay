"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import idl from "./idl.json"; // Ensure the path to the IDL file is correct

const PROGRAM_ID = new PublicKey(
  "HCYMe3QTiuomakptZztstEqyhTaR6ABVazRJAvajVBn1"
);
const NETWORK = "http://127.0.0.1:8899"; // Local Solana validator network

export default function CreateGroupPage() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [groupName, setGroupName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      alert("Please connect your wallet.");
      return;
    }

    console.log("Creating group...");

    try {
      setLoading(true);

      // Set up connection to the Solana network
      const connection = new Connection(NETWORK, "confirmed");
      console.log("Connection established");

      // Create Anchor provider
      const provider = new anchor.AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction: async (transaction) => {
            return await sendTransaction(transaction, connection);
          },
          signAllTransactions: async (transactions) => {
            return await Promise.all(
              transactions.map((tx) => sendTransaction(tx, connection))
            );
          },
        },
        { preflightCommitment: "processed" }
      );

      anchor.setProvider(provider);

      // Log IDL to inspect it
      console.log("IDL:", idl);

      // Ensure IDL is valid before proceeding
      if (!idl || !idl.instructions || !idl.types) {
        throw new Error("Invalid IDL structure");
      }

      // Initialize the program
      //     const program = new anchor.Program(
      //       idl,
      //       provider
      //     ) as unknown as anchor.Program<ProgramType>;
          
      // console.log("Program initialized", program);

      // // Generate a new group account
      // const groupAccount = Keypair.generate();
      // console.log("Group account generated", groupAccount.publicKey.toBase58());

      // // Prepare the arguments
      // const totalAmountBN = new anchor.BN(Number(totalAmount));
      // console.log("Total amount as BN:", totalAmountBN);

      // // Send the `create_group` instruction
      // const tx = await program.methods
      //   .createGroup(groupName, totalAmountBN)
      //   .accounts({
      //     groupAccount: groupAccount.publicKey,
      //     creator: publicKey,
      //     systemProgram: SystemProgram.programId,
      //   })
      //   .signers([groupAccount])
      //   .rpc();

      // console.log("Transaction sent", tx);
      // alert(`Group created successfully! Transaction: ${tx}`);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create the group. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Create Group</h1>
        <div>
          <Label htmlFor="groupName">Group Name</Label>
          <Input
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            required
          />
        </div>
        <div>
          <Label htmlFor="totalAmount">Amount (in SOL)</Label>
          <Input
            id="totalAmount"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="Enter total amount"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </Button>
      </form>
    </div>
  );
}
