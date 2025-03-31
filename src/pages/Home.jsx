import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SolanaLogo from "../assets/images/Solana.png";
import SolanaModel from "../components/SolanaModel";

const Home = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [walletNotDetected, setWalletNotDetected] = useState(false);

  useEffect(() => {
    if (connected) {
      navigate("/dashboard");
    } else {
      if (!window.solana) {
        setWalletNotDetected(true);
      }
      setTimeout(() => setLoading(false), 1000);
    }
  }, [connected, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#ffffff] via-[#f0f4f8] to-[#e2e8f0] text-gray-800 flex items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <img src={SolanaLogo} alt="Solana Logo" className="w-20 h-20 animate-spin-slow" />
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row items-center justify-center text-center p-4 space-y-6 md:space-y-0 md:space-x-6">
            {/* Make SolanaModel Responsive */}
            <div className="w-full max-w-xs md:max-w-md flex justify-center">
              <SolanaModel />
            </div>

            {/* Wallet & Info Section */}
            <div className="md:mt-15 mx-4 text-lg flex flex-col justify-center items-center w-full max-w-md">
              {walletNotDetected && (
                <div className="w-full shadow-xl p-4 bg-red-100 rounded-lg mb-6">
                  <h1 className="text-3xl font-bold mb-4 text-gray-800">Wallet Not Detected</h1>
                  <p className="mb-2 text-gray-600">Please install one of the supported Solana wallets:</p>
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-4">
                    <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-colors duration-300">
                      Phantom Wallet
                    </a>
                    <a href="https://www.solflare.com/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
                      Solflare Wallet
                    </a>
                  </div>
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Solana<span className="text-purple-500">Token</span>Hub
              </h1>
              <p className="text-base md:text-lg mb-6 text-gray-600">
                Connect your wallet to start managing tokens easily
              </p>

              <WalletMultiButton
                className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
              />

              <div className="text-center py-6 text-gray-600 text-sm md:text-base">
                Built with ❤️ By <a className="font-bold text-blue-500" href="https://vedanttathe.netlify.app">Vedant Tathe</a>
              </div>

              <p className="text-sm md:text-lg break-words text-center">
                Note: This is just a demo and does not handle real transactions. 
                (It is built for devnet, i.e., for development and testing purposes)
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
