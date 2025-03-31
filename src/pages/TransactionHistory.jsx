import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import TransactionHistory_Comp from "../components/TransactionHistory_Comp";
import Navbar from "../components/Navbar";


const TransactionHistory = () => {

  return (
    <>
    <Navbar/>
    <TransactionHistory_Comp/>
    </>
  );
};

export default TransactionHistory;
