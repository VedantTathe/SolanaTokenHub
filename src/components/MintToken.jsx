import { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import { createMintToInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const MintToken = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [mintList, setMintList] = useState([]);
  const [selectedMint, setSelectedMint] = useState(null);
  const [mintKeypair, setMintKeypair] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedMints = JSON.parse(localStorage.getItem("mintTokens")) || [];
    setMintList(storedMints);
  }, []);

  const handleMintSelection = (e) => {
    const mintName = e.target.value;
    const selected = mintList.find((mint) => mint.name === mintName);

    if (selected) {
      setSelectedMint(mintName);
      setMintKeypair(Keypair.fromSecretKey(new Uint8Array(selected.secretKey)));
    }
  };

  const handleMint = async () => {
    if (!publicKey || !mintKeypair || !amount || isNaN(amount) || amount <= 0) {
      toast.error("❌ Please select a mint and enter a valid amount.");
      return;
    }

    setLoading(true);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );

      const mintTx = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAddress,
          publicKey,
          amount * 10 ** 9
        )
      );

      const mintSignature = await sendTransaction(mintTx, connection);
      await connection.confirmTransaction(mintSignature, "confirmed");

      toast.success(`✅ Successfully Minted ${amount} Tokens!`);
    } catch (error) {
      console.error("❌ Minting Failed:", error);
      toast.error("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center text-black shadow-xl">
      <div className="bg-white p-6 rounded-2xl w-96 text-center ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mint Token</h2>

        <label className="block mb-2 text-sm text-gray-600">Select Token:</label>
        <select
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          onChange={handleMintSelection}
          defaultValue=""
        >
          <option value="" disabled>Select a Token</option>
          {mintList.map((mint, index) => (
            <option key={index} value={mint.name || "unknown"}>{mint.name || "unknown"}</option>
          ))}
        </select>

        <label className="block mt-4 mb-2 text-sm text-gray-600">Enter Amount:</label>
        <input
          type="number"
          className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          placeholder="Enter token amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />

        <button
          onClick={handleMint}
          disabled={!selectedMint || !amount || loading}
          className={`text-white mt-4 w-full p-2 rounded-md font-semibold transition flex items-center justify-center gap-2 ${
            selectedMint && amount && !loading
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? <Loader className="animate-spin" /> : "Mint Token"}
        </button>
      </div>
    </div>
  );
};

export default MintToken;
