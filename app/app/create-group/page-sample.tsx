// "use client"; // Important for client-side components

// import React, { useState, useEffect } from "react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import * as anchor from "@coral-xyz/anchor";
// import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// // Import your IDL
// import idl from "./idl.json";

// export default function CreateGroupPage() {
//   const [program, setProgram] = useState<Program | null>(null);
//   const [word, setWord] = useState("");
//   const wallet = useWallet();

//   useEffect(() => {
//     if (!wallet.connected) return;

//     try {
//       const connection = new Connection(
//         "https://api.devnet.solana.com",
//         "confirmed"
//       );

//       const provider = new AnchorProvider(connection, wallet, {
//         preflightCommitment: "confirmed",
//       });

//       const programId = new PublicKey(
//         "APtStEwqTqBnGYTbr4EZNxA4wpzfKqcpB2yjT7sg63ao"
//       );

//       // Use Program.at() instead of new Program()
//       const programInstance = Program.at(programId, provider);

//       setProgram(programInstance);
//     } catch (error) {
//       console.error("Error initializing program:", error);
//     }
//   }, [wallet.connected]);

//   const storeWord = async () => {
//     if (!program || !wallet.publicKey) return;

//     try {
//       const wordAccount = web3.Keypair.generate();

//       const tx = await program.methods
//         .initializeWordStorage(word)
//         .accounts({
//           wordAccount: wordAccount.publicKey,
//           authority: wallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .signers([wordAccount])
//         .rpc();

//       console.log("Word stored successfully:", tx);
//     } catch (error) {
//       console.error("Error storing word:", error);
//     }
//   };

//   return (
//     <div>
//       <WalletMultiButton />
//       <input
//         type="text"
//         value={word}
//         onChange={(e) => setWord(e.target.value)}
//         placeholder="Enter word"
//       />
//       <button onClick={storeWord}>Store Word</button>
//     </div>
//   );
// }
