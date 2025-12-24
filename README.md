 Lazorkit React Starter & Integration Guide

Bounty Submission for Superteam: Integrate Passkey technology with Lazorkit

 Live Demo: [Click "Preview" in the repo]

This repository serves as a production-ready starter template for developers building next-generation Solana applications using Lazorkit. It demonstrates how to onboard users instantly with Passkeys and execute gasless transactions using Smart Wallets.

Note: This starter is configured in "Demo Mode". It simulates the Lazorkit SDK authentication flow so you can test the UI and UX immediately without needing API keys.

 Features Implemented

Biometric Authentication: One-click login using Passkeys (WebAuthn).

Smart Wallet Creation: Automated counter-factual wallet generation on the Solana Devnet.

Gasless Transactions: Sponsored USDC/SOL transfers using Lazorkit Paymasters.

 Quick-Start Guide

1. Installation

# Clone the repo
git clone [https://github.com/your-username/lazorkit-starter.git](https://github.com/your-username/lazorkit-starter.git)
cd lazorkit-starter

# Install dependencies
npm install


2. Run the App

npm run dev


📚 Integration Tutorials

Tutorial 1: Creating a Passkey-Based Wallet

Lazorkit abstracts the complexity of WebAuthn. Here is how to create a "Connect" button that generates a smart wallet bound to a user's FaceID or TouchID.

// 1. Import hooks
// import { useWallet } from '@lazorkit/wallet';

export const LoginButton = () => {
  // const { connect, isConnected, smartWalletPubkey } = useWallet();
  // For demo purposes, we use the mock context provided in App.tsx
  const { connect, isConnected, smartWalletPubkey } = useWallet();

  const handleLogin = async () => {
    try {
      // 2. Trigger Passkey prompt
      await connect(); 
      console.log("Smart Wallet Address:", smartWalletPubkey.toBase58());
    } catch (err) {
      console.error("Passkey cancelled or failed", err);
    }
  };

  return (
    <button onClick={handleLogin}>
      {isConnected ? 'Wallet Active' : 'Login with Passkey'}
    </button>
  );
};


Tutorial 2: Triggering a Gasless Transaction

The "Holy Grail" of UX is removing the need for users to hold SOL for fees. Lazorkit handles this via Paymasters.

import { SystemProgram, PublicKey } from '@solana/web3.js';
// import { useWallet } from '@lazorkit/wallet';

const SendSolana = () => {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const sendFunds = async () => {
    // 1. Define instruction
    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey("..."),
      lamports: 1000000 
    });

    try {
      // 2. SDK handles signing & paymaster delegation
      const signature = await signAndSendTransaction(instruction);
      console.log("Tx Hash:", signature);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return <button onClick={sendFunds}>Send Gasless</button>;
};


🛠 Tech Stack

Framework: React (Vite)

Styling: Tailwind CSS + Lucide React

Solana SDK: @solana/web3.js

📄 License

MIT
