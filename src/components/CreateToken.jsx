import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  // createMintToInstruction, // Commented out
} from "@solana/spl-token";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const CreateToken = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mintAddress, setMintAddress] = useState(localStorage.getItem("mintAddress") || "");
  const [tokenAccount, setTokenAccount] = useState(localStorage.getItem("tokenAccount") || "");
  const [tokenName, setTokenName] = useState(localStorage.getItem("tokenName") || "");
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (mintAddress) localStorage.setItem("mintAddress", mintAddress);
    if (tokenAccount) localStorage.setItem("tokenAccount", tokenAccount);
    if (tokenName) localStorage.setItem("tokenName", tokenName);
  }, [mintAddress, tokenAccount, tokenName]);

  const addStep = (message) => {
    setSteps((prev) => [...prev, message]);
    toast(message);
  };

  const handleCreateToken = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("Connect your wallet first!");
      return;
    }
    if (!tokenName.trim()) {
      toast.error("Please enter a token name.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setSteps([]);
    addStep("Starting token creation...");

    try {
      const tempConnection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const mintKeypair = Keypair.generate();
      setMintAddress(mintKeypair.publicKey.toBase58());
      addStep("Creating token account...");

      const lamports = await tempConnection.getMinimumBalanceForRentExemption(MINT_SIZE);
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );
      const signature = await sendTransaction(transaction, tempConnection, { signers: [mintKeypair] });
      await tempConnection.confirmTransaction(signature, "confirmed");
      addStep("Token account created. Setting up associated account...");

      const associatedTokenAddress = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);
      const ataTransaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAddress,
          publicKey,
          mintKeypair.publicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );
      const ataSignature = await sendTransaction(ataTransaction, tempConnection);
      await tempConnection.confirmTransaction(ataSignature, "confirmed");
      setTokenAccount(associatedTokenAddress.toBase58());
      addStep("Associated token account created.");

      // Commenting out minting functionality
      // addStep("Minting initial supply...");
      // const mintTx = new Transaction().add(
      //   createMintToInstruction(
      //     mintKeypair.publicKey,
      //     associatedTokenAddress,
      //     publicKey,
      //     10 * 10 ** 9
      //   )
      // );
      // const mintSignature = await sendTransaction(mintTx, tempConnection);
      // await tempConnection.confirmTransaction(mintSignature, "confirmed");
      // addStep("Token successfully minted!");

      const storedTokens = JSON.parse(localStorage.getItem("mintTokens")) || [];
      storedTokens.push({
        name: tokenName,
        mint: mintKeypair.publicKey.toBase58(),
        secretKey: Array.from(mintKeypair.secretKey),
      });
      localStorage.setItem("mintTokens", JSON.stringify(storedTokens));

      setSuccess(true);
    } catch (error) {
      console.error("Token creation failed:", error);
      toast.error("Error: " + error.message);
      addStep("Token creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 text-black bg-white max-w-lg mx-auto shadow-lg rounded-xl ">
      <input
        type="text"
        placeholder="Enter Token Name"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        className="mb-3 p-2 w-full rounded bg-gray-100 text-black border border-gray-300"
      />
      <button
        onClick={handleCreateToken}
        disabled={loading}
        className={`text-white mt-4 w-full flex items-center justify-center px-4 py-2 text-black font-bold rounded ${
          loading ? "bg-gray-300" : "bg-purple-500 hover:bg-purple-600"
        }`}
      >
        {loading ? <Loader className="animate-spin" /> : "Create Token"}
      </button>
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold text-purple-500">Progress</h3>
        <ul className="mt-2 text-sm text-gray-700">
          {steps.map((step, index) => (
            <li key={index} className="mb-1">✅ {step}</li>
          ))}
        </ul>
      </div>
      {success && <p className="mt-3 text-green-500 text-center">✅ Token "{tokenName}" Successfully Created!</p>}
    </div>
  );
};

export default CreateToken;
