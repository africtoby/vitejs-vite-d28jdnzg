import React, { useState, useEffect } from 'react';
import { 
  Wallet, Fingerprint, Send, ShieldCheck, LogOut, Loader2, Copy, CheckCircle2, ExternalLink
} from 'lucide-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// --- MOCK CONTEXT (Simulates the Lazorkit SDK for Demo purposes) ---
const MockLazorkitContext = React.createContext<any>(null);

const useWallet = () => {
  const context = React.useContext(MockLazorkitContext);
  if (!context) throw new Error("useWallet must be used within LazorkitProvider");
  return context;
};

// --- APP COMPONENT ---
export default function App() {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [smartWalletPubkey, setSmartWalletPubkey] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Mock Login
  const handleConnect = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Fake delay
    setSmartWalletPubkey(new PublicKey("LazorKi7w1VNeRZgDWH5qmNz2XFq5QeZbqC8caqSE5W"));
    setIsConnected(true);
    setIsLoading(false);
  };

  // Mock Fetch Balance
  useEffect(() => {
    if (isConnected) setTimeout(() => setBalance(2.45), 500);
  }, [isConnected]);

  // Mock Transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !recipient) return;
    setIsSending(true);
    await new Promise(r => setTimeout(r, 2000)); // Fake delay
    setTxHash("5K2...mockSignature...3j9");
    setBalance(prev => prev ? prev - parseFloat(amount) : 0);
    setIsSending(false);
    setAmount('');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-lg">
          <Fingerprint size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Lazorkit Wallet</h1>
        <p className="text-indigo-200 mb-8">No seed phrases. Just Passkeys.</p>
        <button 
          onClick={handleConnect}
          disabled={isLoading}
          className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg hover:bg-indigo-50 transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Fingerprint />}
          Sign in with Passkey
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans max-w-md mx-auto shadow-2xl bg-white flex flex-col">
      {/* Header */}
      <header className="p-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Wallet className="text-indigo-600" /> My Wallet
        </div>
        <button onClick={() => setIsConnected(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full">
          <LogOut size={20} />
        </button>
      </header>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
           <p className="text-indigo-100 text-sm font-medium">Total Balance</p>
           <h2 className="text-4xl font-bold mt-1 mb-4">
             {balance === null ? "..." : `$${balance.toFixed(2)}`}
           </h2>
           <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg text-xs font-mono">
              <span className="truncate">{smartWalletPubkey?.toBase58()}</span>
              <Copy size={12} className="cursor-pointer" />
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded-xl flex flex-col items-center gap-2 shadow-sm">
            <ShieldCheck className="text-green-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Security</span>
            <span className="text-sm font-medium">Biometric</span>
          </div>
          <div className="p-4 bg-white border rounded-xl flex flex-col items-center gap-2 shadow-sm">
            <Send className="text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Fees</span>
            <span className="text-sm font-medium">Sponsored</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTransfer} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold flex items-center gap-2"><Send size={16} /> Send SOL</h3>
          <input 
            className="w-full p-3 bg-slate-50 border rounded-xl text-sm" 
            placeholder="Recipient Address..."
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          <div className="relative">
             <input 
               type="number" 
               className="w-full p-3 bg-slate-50 border rounded-xl text-sm" 
               placeholder="0.00"
               value={amount}
               onChange={e => setAmount(e.target.value)}
             />
             <span className="absolute right-4 top-3 text-slate-400 text-xs font-bold">SOL</span>
          </div>
          <button 
            disabled={isSending || !amount}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSending ? <Loader2 className="animate-spin" /> : "Send (Gasless)"}
          </button>
        </form>

        {/* Success Msg */}
        {txHash && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-3">
            <CheckCircle2 className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">Sent Successfully</p>
              <a href="#" className="text-xs text-green-600 underline">View on Explorer</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}