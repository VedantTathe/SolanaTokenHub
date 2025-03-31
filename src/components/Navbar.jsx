import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FiMenu, FiX } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <nav className="text-gray-800 fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-300 animate-slide-down transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🔷 Logo */}
          <Link to="/" className="text-2xl font-extrabold text-gray-800 tracking-wide">
            Solana<span className="text-purple-500">Token</span>Hub
          </Link>

          {/* 🔹 Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {connected ? (
              <>
                <Link to="/dashboard" className="nav-link text-gray-800 hover:text-purple-500">
                  Dashboard
                </Link>
                <Link to="/transfersol" className="nav-link text-gray-800 hover:text-purple-500">
                  Transfer SOL
                </Link>
                <Link to="/history" className="nav-link text-gray-800 hover:text-purple-500">
                  Transaction History
                </Link>
              </>
            ) : (
              <Link to="/" className="nav-link text-gray-800 hover:text-purple-500">
                Home
              </Link>
            )}

            {/* 🟣 Wallet Button */}
            <div className="wallet-btn-container">
              <WalletMultiButton className="wallet-btn !bg-purple-600 !text-white !px-5 !py-2 !rounded-lg border-2 border-purple-500 shadow-md hover:shadow-purple-500/50 transition-transform transform hover:scale-105" />
            </div>
          </div>

          {/* 📱 Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-800 focus:outline-none"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center space-y-6 transition-all duration-500 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
        } md:hidden`}
      >
        {/* 📌 Close Button (Does NOT Disappear) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-6 text-gray-800 text-3xl"
        >
          <FiX />
        </button>

        {connected ? (
          <>
            <Link
              to="/dashboard"
              className="mobile-nav-link text-gray-800 hover:text-purple-500"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/transfersol"
              className="mobile-nav-link text-gray-800 hover:text-purple-500"
              onClick={() => setIsOpen(false)}
            >
              Transfer SOL
            </Link>
            <Link
              to="/history"
              className="mobile-nav-link text-gray-800 hover:text-purple-500"
              onClick={() => setIsOpen(false)}
            >
              Transaction History
            </Link>
          </>
        ) : (
          <Link
            to="/"
            className="mobile-nav-link text-gray-800 hover:text-purple-500"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
        )}

        {/* 🟣 Wallet Button for Mobile */}
        <div className="w-full flex justify-center px-4">
          <WalletMultiButton className="wallet-btn w-full max-w-xs !bg-purple-600 !text-white !px-6 !py-2 !rounded-lg border-2 border-purple-500 shadow-md hover:shadow-purple-500/50 transition-transform transform hover:scale-105" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
