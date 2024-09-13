'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import Link from "next/link";
import React, { useState } from "react";

export const PingButton = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [text, setText] = useState("");
    const [link, setLink] = useState("")

    const PROGRAM_ID = new PublicKey(
        "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa",
    );
    const DATA_ACCOUNT_PUBKEY = new PublicKey(
        "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod",
    );

    const onClick = async () => {
        if (!connection || !publicKey) {
          console.error("Wallet not connected or connection unavailable");
        }

       
        try {
          const programId = new PublicKey(PROGRAM_ID);
          const programDataAccount = new PublicKey(DATA_ACCOUNT_PUBKEY);
          const transaction = new Transaction();
       
          const instruction = new TransactionInstruction({
            keys: [
              {
                pubkey: programDataAccount,
                isSigner: false,
                isWritable: true,
              },
            ],
            programId,
          });
       
          transaction.add(instruction);
       
          const signature = await sendTransaction(transaction, connection);
          console.log("Transaction Signature:", signature);
          setText("Transaction Signature: " + signature)
          setLink(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
        } catch (error) {
          console.error("Transaction failed:", error);
          setText("Transaction failed")
        }
      };
    
	return (
        <div className=" flex flex-col gap-y-8 items-center w-96">
            <div className='cursor-pointer py-4 px-12 bg-gradient-to-tr from-violet-700 to-emerald-400 w-fit rounded-lg font-semibold animate-pulse' onClick={onClick}>
                PING
            </div>
            {text && 
            <div className="w-96 min-h-24 p-4 mt-12 bg-slate-600 border-[1px] border-slate-200 rounded-lg">
                <div className="h-full pb-8 overflow-x-auto whitespace-nowrap scrollbar-thin">
                    {text}
                </div>
            </div>}
            {link && 
            <Link href={link} className="w-64  text-center text-slate-400 underline underline-offset-1">
                See in Explorer &#x2197;
            </Link>}
        </div>
	)
}