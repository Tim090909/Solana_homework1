'use client'

import React, { useEffect, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link';
import { Check, Frown } from 'lucide-react';

const formSchema = z.object({
    address: z.string().min(2).max(50),
    amount: z.number().positive("Amount must be positive").min(0.001, "Minimum amount is 0.001 SOL")
})


const Sender = () => {
    const { publicKey, connected, sendTransaction } = useWallet();
    const [balance, setBalance] = useState<number | null>(null)
    const [link, setLink] = useState("")
    const [error, setError] = useState("")
    const [transactionStatus, setTransactionStatus] = useState("preparing")
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          address: "",
          amount: 0
        },
      })
     
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!connected || !publicKey) {
          console.error("Wallet not connected or connection unavailable");
          return;
        }
    
        try {
          const recipientPubkey = new PublicKey(values.address);
          const amountInLamports = values.amount * LAMPORTS_PER_SOL;
    
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: recipientPubkey,
              lamports: amountInLamports,
            })
          );
    
          // Send transaction
          const signature = await sendTransaction(transaction, connection);
          //await connection.confirmTransaction(signature, "confirmed");
    
          setTransactionStatus("successful")
          setLink(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
          setBalance(balance! - values.amount)
        } catch (error) {
            setTransactionStatus("failed")
            setError("Transaction failed")
            console.error("Transaction failed:", error);
        }
    };

    const getWalletBalance = async () => {
        console.log("ok")
        if(connected && publicKey){
            console.log("okk")
            try {
                const balanceInLamports = await connection.getBalance(publicKey);
                const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
                setBalance(balanceInSOL);
            } catch(error) {
                console.error('Error fetching balance:', error);
            }
        }
    }

    useEffect(() => {
        getWalletBalance();
    }, [connected, publicKey])
    
  return (
    <div className='w-80 md:w-96'>
       {connected ? (
        <div>
        <div className='font-semibold text-xl tracking-wide'>Balance: {balance !== null ? balance.toFixed(2) + 'SOL' : 'Loading balance...'}</div>
        {transactionStatus === 'preparing' ? (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-96 mt-12">
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter recepient address" autoComplete='false' {...field} />
                        </FormControl>
                        <FormDescription>
                            SOL address to which you want to send.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter amount of SOL" type="number" step="0.001" value={field.value} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}/>
                        </FormControl>
                        <FormDescription>
                            How mach SOL do you want to send.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={!form.formState.isValid}>Send</Button>
                </form>
            </Form>) : (transactionStatus === 'successful' ? (
                <div className='w-full items-center flex flex-col gap-y-4 mt-16'>
                    <Check  className=' w-32 h-32 p-4 rounded-full bg-green-500'/>
                    {link && 
                        <Link href={link} target='new' className="w-64  text-center text-slate-400 underline underline-offset-1">
                            See in Explorer &#x2197;
                        </Link>
                    }
                    <Button onClick={() => {setTransactionStatus('preparing'); setLink("") ; setError(""); getWalletBalance()}} className='bg-gradient-to-tr from-violet-700 to-emerald-400'>Send more</Button>
                </div>
            ) : (
            <div className='w-full items-center flex flex-col gap-y-4 mt-16'>
                <Frown className=' w-32 h-32 p-4 rounded-full bg-red-600'/>
                {error && 
                    <div className="w-64 text-center text-slate-400">
                        {error}
                    </div>
                }
                <Button onClick={() => setTransactionStatus('preparing')} className='bg-gradient-to-tr from-violet-700 to-emerald-400'>Try more</Button>
            </div>)

            )}
        </div>
    ) : (
        <div className='text-lg font-semibold animate-bounce'>To make transaction. Please connect your wallet &#x2197;</div>
        ) }
    </div>
  )
}

export default Sender
