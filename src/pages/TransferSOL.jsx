import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "../components/Navbar";
import TransferSOL_Comp from "../components/TransferSOL_Comp";

const TransferSOL = () => {
    

    return (
        // <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
        <div>
            <Navbar/>
            <div className="pt-25">

            <TransferSOL_Comp/>
            </div>
        </div>
    );
};

export default TransferSOL;
