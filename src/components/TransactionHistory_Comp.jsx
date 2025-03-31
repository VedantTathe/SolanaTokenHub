import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const SOLANA_RPC_URL = clusterApiUrl("devnet");

const TransactionHistory_Comp = () => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (publicKey) {
      fetchTransactions(publicKey);
    }
  }, [publicKey]);

  const fetchTransactions = async (walletAddress) => {
    setLoading(true);
    setError(null);
    try {
      const connection = new Connection(SOLANA_RPC_URL);
      const walletPublicKey = new PublicKey(walletAddress);
      
      // Get transaction signatures
      const signatures = await connection.getSignaturesForAddress(walletPublicKey, { limit: 10 });
      
      // Fetch detailed transaction data
      const txDetails = await Promise.all(
        signatures.map(async (sig) => {
          return await connection.getTransaction(sig.signature, { commitment: "confirmed" });
        })
      );

      setTransactions(txDetails.filter((tx) => tx)); // Remove null transactions
    } catch (err) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-25 p-4 bg-white text-black min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Phantom Wallet Transactions</h1>
      {!publicKey ? (
        <p className="text-center text-red-500">Connect your wallet to view transactions</p>
      ) : (
        <div className="w-full max-w-xl">
          {loading && <p className="text-center">Loading transactions...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {transactions.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500">No transactions found</p>
          )}
          <ul className="space-y-4">
            {transactions.map((tx, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p className="break-words"><strong>Signature:</strong> {tx?.transaction?.signatures[0]}</p>
                <p><strong>Block Time:</strong> {tx?.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A"}</p>
                <p><strong>Slot:</strong> {tx?.slot}</p>
                <a
                  href={`https://solscan.io/tx/${tx?.transaction?.signatures[0]}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >View on Solscan</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory_Comp;
