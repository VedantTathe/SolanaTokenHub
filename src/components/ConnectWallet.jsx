import { useState } from "react";

const ConnectWallet = ({ onConnect }) => {
  const [error, setError] = useState(null);

  const connectWallet = async (walletType) => {
    try {
      let provider;
      if (walletType === "phantom") {
        provider = window.solana;
      } else if (walletType === "solflare") {
        provider = window.solflare;
      } else if (walletType === "sollet") {
        provider = new window.SolletWalletAdapter();
      }

      if (!provider) throw new Error(`${walletType} Wallet not found!`);
      
      const response = await provider.connect();
      onConnect(response.publicKey.toString());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={() => connectWallet("phantom")}
        className="px-6 py-3 w-64 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
      >
        Connect Phantom
      </button>
      <button
        onClick={() => connectWallet("solflare")}
        className="px-6 py-3 w-64 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
      >
        Connect Solflare
      </button>
      <button
        onClick={() => connectWallet("sollet")}
        className="px-6 py-3 w-64 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600"
      >
        Connect Sollet
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ConnectWallet;
