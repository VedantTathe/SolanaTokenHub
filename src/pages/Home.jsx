import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SolanaLogo from "../assets/images/Solana.png"; // Import the image

const Home = () => {
  const { connected, wallet } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletNotDetected, setWalletNotDetected] = useState(false);

  useEffect(() => {
    if (connected) {
      navigate("/dashboard");
    } else {
      if (!wallet) {
        setWalletNotDetected(true);
      }
      setTimeout(() => setLoading(false), 500);
    }
  }, [connected, navigate, wallet]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#ffffff] via-[#f0f4f8] to-[#e2e8f0] text-gray-800 flex items-center justify-center">
        <div className="mt-20 md: mt-2 flex flex-col md:flex-row items-center align-content-center justify-content-center text-center p-6 space-x-6">
          {/* Solana Image on the Left with Adjusted Position */}
          <img
            src={SolanaLogo}
            alt="Solana Logo"
            className="w-60 h-60 md:w-80 md:h-80 object-contain"
          />

          {/* Content on the Right */}
          <div className="flex flex-col justify-center items-center">
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : walletNotDetected ? (
              <div className="mb-6 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                  Wallet Not Detected
                </h1>
                <p className="text-lg mb-2 text-gray-600">
                  Please install one of the supported Solana wallets:
                </p>
                <div className="flex  space-x-4 mt-4">
                  <a
                    href="https://phantom.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-colors duration-300"
                  >
                    Phantom Wallet
                  </a>
                  <a
                    href="https://www.solflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Solflare Wallet
                  </a>
                </div>
              </div>
            ) : (<></>)}
              <>
                <h1 className="mt-2 text-5xl font-bold mb-4 text-gray-800">
                  Solana<span className="text-purple-500">Token</span>Hub
                </h1>
                <p className="text-lg mb-6 text-gray-600">
                  Connect your wallet to start managing tokens easily
                </p>
                <WalletMultiButton
                  style={{
                    backgroundColor: "rgb(59, 130, 246)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    transition: "transform 0.2s ease-in-out",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0px 4px 10px rgba(59, 130, 246, 0.6)",
                  }}
                />
              </>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
