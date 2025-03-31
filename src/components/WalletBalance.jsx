import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const WalletBalance = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    const connection = new Connection(clusterApiUrl("devnet"));

    const fetchBalance = async () => {
      setLoading(true);
      const bal = await connection.getBalance(new PublicKey(publicKey));
      setBalance(bal / 1e9); // Convert lamports to SOL
      setLoading(false);
    };

    fetchBalance(); // Fetch balance initially

    const interval = setInterval(fetchBalance, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [publicKey]);

  return (
    <div className={`mt-4 text-lg font-semibold text-gray-800 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
      {loading ? "Fetching.." : "Balance"}: {balance !== null ? `${balance} SOL` : "Loading..."}
    </div>
  );
};

export default WalletBalance;
