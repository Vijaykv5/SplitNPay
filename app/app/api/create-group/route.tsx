import { NextApiRequest, NextApiResponse } from "next";
import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

// Define the IDL and Program ID for the group contract (replace with your actual IDL)
const GROUP_IDL = {
  version: "0.1.0",
  name: "paytogether",
  accounts: [
    {
      name: "Group",
      discriminator: [209, 249, 208, 63, 182, 89, 186, 254],
    },
    {
      name: "Participant",
      discriminator: [32, 142, 108, 79, 247, 179, 54, 6],
    },
  ],
  instructions: [
    {
      name: "create_group",
      discriminator: [79, 60, 158, 134, 61, 199, 56, 248],
      accounts: [
        { name: "group", writable: true, signer: true },
        { name: "organizer", writable: true, signer: true },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [{ name: "total_amount", type: "u64" }],
    },
  ],
  types: [
    {
      name: "Group",
      type: {
        kind: "struct",
        fields: [
          { name: "organizer", type: "pubkey" },
          { name: "total_amount", type: "u64" },
          { name: "collected_amount", type: "u64" },
        ],
      },
    },
  ],
};

// Program ID (replace with the actual Program ID of your contract)
const GROUP_PROGRAM_ID = new PublicKey(
  "2ZzrLXe8EKYiY3BHthebN6wpC4zcP8QA1Bu1X1XE8PDF"
);

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed"
);

interface CreateGroupRequestBody {
  groupName: string;
  totalAmount: number;
  participants: string[];
  splitType: string;
  customSplit?: string;
  walletAddress: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      groupName,
      totalAmount,
      participants,
      splitType,
      customSplit,
      walletAddress,
    }: CreateGroupRequestBody = req.body;

    try {
      const provider = new Provider(connection, new web3.Account(), {
        preflightCommitment: "processed",
      });

      const program = new Program(GROUP_IDL, GROUP_PROGRAM_ID, provider);

      // Generate a new account for the group
      const groupAccount = Keypair.generate();
      const groupPublicKey = groupAccount.publicKey;

      // Deploy the contract to create a group
      await program.rpc.createGroup(
        groupName,
        totalAmount,
        splitType,
        customSplit,
        participants.map((address) => new PublicKey(address)),
        {
          accounts: {
            group: groupPublicKey,
            organizer: new PublicKey(walletAddress),
            systemProgram: SystemProgram.programId,
          },
          signers: [groupAccount],
        }
      );

      // Generate a shareable link for the group
      const groupLink = `https://your-dapp-url.com/group/${groupPublicKey.toBase58()}`;

      res.status(200).json({ groupLink });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ error: "Error creating group" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
