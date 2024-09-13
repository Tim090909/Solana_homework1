'use client'

import Image from "next/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
 
export const AppBar = () => {
  return (
    <div className='h-24 w-full flex justify-between items-center container px-6 mx-auto'>
      <Image src="/solanaLogo.png" alt="logo" height={30} width={200} />
      <span className="hidden md:block text-2xl font-semibold text-slate-300 ">Wallet-adapter example</span>
      <WalletMultiButton />
    </div>
  );
};