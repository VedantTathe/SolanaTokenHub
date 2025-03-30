import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

const WalletBalance = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!publicKey) return;

    const connection = new Connection(clusterApiUrl("devnet"));
    connection.getBalance(new PublicKey(publicKey)).then((bal) => {
      setBalance(bal / 1e9); // Convert lamports to SOL
    });
  }, [publicKey]);

  return (
    <div className="mt-4 text-lg font-semibold text-gray-800">
      Balance: {balance !== null ? `${balance} SOL` : "Loading..."}
    </div>
  );
};

export default WalletBalance;
