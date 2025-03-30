import { useEffect, useState } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const TransferToken = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [tokenList, setTokenList] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem("mintTokens")) || [];
    setTokenList(storedTokens);
  }, []);

  const handleTokenSelection = (e) => {
    const tokenMint = e.target.value;
    const selected = tokenList.find((token) => token.mint === tokenMint);
    if (selected) {
      setSelectedToken(selected);
    }
  };

  const validateRecipient = (recipient) => {
    try {
      new PublicKey(recipient);
      return true;
    } catch {
      return false;
    }
  };

  const handleTransfer = async () => {
    if (!publicKey || !selectedToken || !recipient || !amount || isNaN(amount) || amount <= 0) {
      toast.error("❌ Please select a token, enter a valid recipient, and amount.");
      return;
    }

    if (!validateRecipient(recipient)) {
      toast.error("❌ Invalid recipient address.");
      return;
    }

    setLoading(true);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    try {
      const recipientPublicKey = new PublicKey(recipient);
      const mintPublicKey = new PublicKey(selectedToken.mint);
      
      // Get sender's token account
      const senderTokenAccount = await getAssociatedTokenAddress(mintPublicKey, publicKey);

      // Check if the recipient's associated token account exists
      let recipientTokenAccount;
      try {
        recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);
      } catch (error) {
        if (error instanceof Error && error.message.includes("TokenAccountNotFoundError")) {
          recipientTokenAccount = await createAssociatedTokenAccount(
            connection,
            publicKey,
            mintPublicKey,
            recipientPublicKey
          );
        } else {
          throw error;
        }
      }

      // Ensure correct amount formatting (token decimals dynamically fetched)
      const decimals = selectedToken.decimals || 9; // Default to 9 decimals if not provided
      const transferAmount = Math.floor(amount * 10 ** decimals); // Adjust for token's decimals

      // Create the transfer instruction
      const transferInstruction = createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        publicKey,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      const transaction = new Transaction().add(transferInstruction);
      
      // Set the fee payer
      transaction.feePayer = publicKey; // Set the sender as the fee payer

      // Get the recent blockhash
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash; // Set the recent blockhash for the transaction

      // Send the transaction
      const signature = await sendTransaction(transaction, connection, { preflightCommitment: "confirmed" });

      // Wait for confirmation
      const { value: signatureStatus } = await connection.getSignatureStatus(signature);
      console.log("Transaction status:", signatureStatus);

      if (signatureStatus?.confirmationStatus === "confirmed") {
        toast.success(`✅ Successfully transferred ${amount} ${selectedToken.name} tokens!`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("❌ Transfer Failed:", error);
      toast.error("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Transfer Token</h2>
        
        {/* Select Token */}
        <select
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          onChange={handleTokenSelection}
          defaultValue=""
          disabled={loading}
        >
          <option value="" disabled>Select a Token</option>
          {tokenList.map((token, index) => (
            <option key={index} value={token.mint}>
              {token.name || "unknown"}
            </option>
          ))}
        </select>

        {/* Enter Recipient Address */}
        <input
          type="text"
          placeholder="Recipient Address"
          className="w-full p-2 mt-4 mb-2 bg-gray-700 text-white"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        {/* Enter Amount */}
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 bg-gray-700 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={!selectedToken || !recipient || !amount || loading}
          className={`mt-4 w-full p-2 rounded-md font-semibold ${selectedToken && recipient && amount && !loading ? 'bg-purple-500' : 'bg-gray-600 cursor-not-allowed'}`}
        >
          {loading ? "Transferring..." : "Transfer Token"}
        </button>
      </div>
    </div>
  );
};

export default TransferToken;
