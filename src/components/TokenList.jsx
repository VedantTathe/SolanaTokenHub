import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";

const TokenList = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to get token name from localStorage
  const getTokenName = (mint) => {
    try {
      const storedData = localStorage.getItem("mintTokens");
      if (!storedData) return "Unknown Token";
  
      const tokens = JSON.parse(storedData); // Only parse once
      const token = tokens.find((t) => t.mint === mint);
      return token ? token.name : "Unknown Token"; // Fix: Check if token exists before accessing `name`
    } catch (error) {
      console.error("Error retrieving token name:", error);
      return "Unknown Token";
    }
  };

  const fetchTokens = async () => {
    if (!publicKey) {
      return;
    }

    setLoading(true);
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
      );

      const tokenList = tokenAccounts.value.map((account) => {
        const info = account.account.data.parsed.info;
        return {
          mint: info.mint,
          name: getTokenName(info.mint), // Fetch name from localStorage
          balance: info.tokenAmount.uiAmount,
        };
      });

      setTokens(tokenList);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      // alert("Error fetching tokens!");
    }
    setLoading(false);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <>
      <h2 className="pt-2 text-2xl font-semibold text-gray-800 mb-4">
        My Tokens
      </h2>

      <button
        onClick={fetchTokens}
        className={`bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl font-semibold transition duration-200 ease-in-out shadow-md ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Refresh Tokens"}
      </button>

      {tokens.length > 0 ? (
        <div className="mt-6 w-full p-4 bg-gray-50 rounded-lg shadow-md overflow-x-hidden max-h-screen overflow-y-auto text-wrap">
          <ul className="space-y-3">
            {tokens.map((token, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center transition hover:bg-gray-100"
              >
                <div>
                  <p className="text-md font-medium text-gray-700 w-full overflow-hidden truncate">
                    <span className="text-gray-800 font-bold">Name:</span> {token.name || "Unknown Token"}
                  </p>
                  <p className="text-md font-medium text-gray-700 w-full overflow-hidden truncate">
                    <span className="text-gray-800 font-bold">Mint:</span> {`${token.mint.slice(0, 6)}...${token.mint.slice(-6)}`}
                  </p>
                  <p className="text-md text-gray-600">
                    <span className="text-gray-800 font-bold">Balance:</span> {token.balance}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-gray-500 text-lg">
          No tokens found. Click refresh to update.
        </p>
      )}
    </>
  );
};

export default TokenList;
