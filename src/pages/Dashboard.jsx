import { useWallet } from "@solana/wallet-adapter-react";
import WalletBalance from "../components/WalletBalance";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateToken from "../components/CreateToken";
import TokenList from "../components/TokenList";
import MintToken from "../components/MintToken";
import TransferSOL_Comp from "../components/TransferSOL_Comp";
import TransactionHistory_Comp from "../components/TransactionHistory_Comp";

const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const navigate = useNavigate();

  // State to manage which section is selected
  const [selectedSection, setSelectedSection] = useState("tokenManager");

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2e8f0] via-[#f3f4f6] to-[#f9fafb] text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Layout */}
      <div className="pt-25 max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section: Wallet Balance & Token List */}
        <div className="md:col-span-1 space-y-2 md:space-y-10">
          {/* Wallet Balance */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700">Wallet Balance</h2>
            <div className="mt-4">
              <WalletBalance />
            </div>
          </div>

          {/* Token List */}
          <div className="hidden md:block bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700">Your Tokens</h2>
            <TokenList />
          </div>
        </div>

        {/* Right Section: Token Manager with Tabs */}
        <div className="md:col-span-2 space-y-6 w-full">
          {/* Token Manager Tabs */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 text-2xl font-bold  text-center">Token Manager</h1>
            <p className="text-xl text-center py-2 mb-3">Select one tab from below</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {/* Token Manager Block */}
              <div 
                onClick={() => setSelectedSection("tokenManager")}
                className={`${
                  selectedSection === "tokenManager" ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"
                } p-6 rounded-lg text-center cursor-pointer`}
              >
                <h3 className="text-xl font-semibold">Token Manager</h3>
              </div>

              {/* Transfer SOL Block */}
              <div 
                onClick={() => setSelectedSection("transferSOL")}
                className={`${
                  selectedSection === "transferSOL" ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"
                } p-6 rounded-lg text-center cursor-pointer`}
              >
                <h3 className="text-xl font-semibold">Transfer SOL</h3>
              </div>

              {/* Transaction History Block */}
              <div 
                onClick={() => setSelectedSection("transactionHistory")}
                className={`${
                  selectedSection === "transactionHistory" ? "bg-purple-500 text-white" : "bg-gray-300 text-gray-700"
                } p-6 rounded-lg text-center cursor-pointer`}
              >
                <h3 className="text-xl font-semibold">Transaction History</h3>
              </div>
            </div>
          </div>

          {/* Content based on selected section */}
          {selectedSection === "tokenManager" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 pt-4">Solana Token Creator</h2>
              <CreateToken />
              <h2 className="text-lg font-semibold text-gray-700 pt-4">Mint Token</h2>
              <MintToken />
            </div>
          )}

          {selectedSection === "transferSOL" && (
            <div className="bg-white shadow-lg rounded-lg py-2">
              <TransferSOL_Comp />
            </div>
          )}

          {selectedSection === "transactionHistory" && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">📜 Transaction History</h2>
              <TransactionHistory_Comp />
            </div>
          )}
        </div>

        {/* Token List (Mobile View) */}
        <div className="block md:hidden bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700">📜 Your Tokens</h2>
          <TokenList />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-600">
        © {new Date().getFullYear()} Solana Dashboard | Built with ❤️ By <a className="font-bold text-blue-500" href="https://vedanttathe.netlify.app">Vedant Tathe</a>
      </div>
    </div>
  );
};

export default Dashboard;
