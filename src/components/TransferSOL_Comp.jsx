import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const TransferSOL_Comp = () => {
    const wallet = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransfer = async () => {
        if (!wallet || !wallet.publicKey) {
            setMessage("⚠️ Please connect your wallet first!");
            return;
        }

        if (!recipient || !amount) {
            setMessage("⚠️ Enter recipient address and amount.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * 1e9, // Convert SOL to lamports
                })
            );

            const { blockhash } = await connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = wallet.publicKey;

            const signedTransaction = await wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            setMessage(`✅ Transaction Sent! Signature: ${signature}`);
            console.log("Transaction Signature:", signature);
        } catch (error) {
            console.error("Transaction Error:", error);
            setMessage(`❌ Error: ${error.message || "Unknown Error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6">
            <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-300 max-w-md w-full pt-5 transition-transform duration-300">
                <h2 className="text-4xl font-extrabold text-center mb-6 text-purple-600 tracking-wide">
                    Transfer SOL
                </h2>

                <div className="space-y-5">
                    {/* Recipient Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black placeholder-gray-600 shadow-inner"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>

                    {/* Amount Input */}
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Amount (SOL)"
                            className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black placeholder-gray-600 shadow-inner"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={handleTransfer}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : " Send SOL"}
                    </button>

                    {/* Message Display */}
                    {message && (
                        <p
                            className={`break-words mt-4 text-center text-lg font-semibold p-3 rounded-lg shadow-md ${
                                message.includes("✅")
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                            }`}
                        >
                            {message.includes("✅") ? "✅ Success: " : "❌ Error: "}
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransferSOL_Comp;
