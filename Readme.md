
  <img src="https://i.ibb.co/v43L7j7Y/1500x500.jpg" alt="Banner" style="width:100%; height:auto;" />
</p>

<h1 align="center">SplitNPay</h1>

<p align="center">
  <img src="https://i.ibb.co/NcKCRdy/S00-D4-IWw-600x600.jpg" alt="SplitNPay Logo" width="250" height="250" />
</p>

<br/>

**SplitNPay** is a decentralized application (dApp) that simplifies group payments on the **Solana blockchain**. 
``` Make your on chain payments easier ```
It allows users to create payment requests, split bills among multiple participants, and track payment statuses in a transparent and secure manner.

## Overview

**SplitNPay** solves the hassle of splitting group payments by allowing users to pool funds into a shared wallet and automatically settle balances, eliminating manual calculations and delays in payments.



<img width="1217" alt="architecture" src="https://github.com/user-attachments/assets/f885f3a1-dafb-4396-aa9c-688412a1af5d" />




---

## Features

- Create group payment requests
- Split bills among multiple participants
- Secure transactions on the Solana blockchain
- User-friendly and intuitive interface
- User authentication and wallet integration

---

## Tech Stack

- **Frontend**: Next js (v14.2.25)
- **Blockchain**: Solana
- **Smart Contracts**: Anchor Framework
- **Development Language**: TypeScript

---

## Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) package manager
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli)
- [Rust](https://www.rust-lang.org/tools/install) (for smart contract development)
- [Anchor Framework](https://book.anchor-lang.com/)

---

## Installation

1. Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/yourusername/splitnpay.git
cd app
```
Install the dependencies:

```bash
npm install
```
Create a .env file in your root directory and add the following environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=
```

Start the development server:
```
npm run dev
```

Project Structure
```
splitNpay/
├── app/           # Frontend application
├── programs/      # Solana smart contracts (WIP)
├── contexts/      # React contexts
├── lib/           # Utility functions and helpers
├── tests/         # Test files
├── migrations/    # Database migrations
└── node_modules/  # Dependencies

```
Frontend
The frontend is built using Next.js and includes:
- User Authentication: Authenticate users by connecting their wallets.

- Group Creation Interface: Allow users to create customized payment groups.

- User Profile Management: Manage groups the user has created or been invited to.

- Sharing Links: Share group invitations via a link; users can join using a group ID.

Smart Contracts (Work in Progress, not yet deployed/linked)
The project uses the Anchor Framework for Solana smart contract development. The smart contract (currently under active development) will handle:
- Payment request creation
- Payment splitting among participants
- Payment tracking
- Secure fund distribution

Contributing
We welcome contributions! Here’s how you can help:

Fork the repository.

Create a new branch:

```
git checkout -b feat/your-feature
```
Commit your changes:
```
git commit -m "Add: your feature description"
```
Push your branch:
```
git push origin feat/your-feature
```
Open a Pull Request.

Support
If you encounter any issues or have questions, please feel free to open an issue on GitHub.

Follow us for updates: [**SplitNPay on X**](https://x.com/splitnpay)

License
This project is licensed under the MIT License.
