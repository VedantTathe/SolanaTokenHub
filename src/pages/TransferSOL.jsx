import React, { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "../components/Navbar";
import TransferSOL_Comp from "../components/TransferSOL_Comp";

const TransferSOL = () => {
    

    return (
        <div>
            <Navbar/>
            <div className="pt-25">

            <TransferSOL_Comp/>
            </div>
        </div>
    );
};

export default TransferSOL;
