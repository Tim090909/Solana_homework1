import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment, airdropIfRequired } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
console.log(`Please provide a public key to send to`);
process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

await airdropIfRequired(
    connection,
    senderKeypair.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL,
);

console.log(
`✅ Loaded our own keypair, the destination public key, and connected to Solana`,
);

const transaction = new Transaction();
 
const SOL_TO_SEND = 0.5;
 
const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey,
  lamports: LAMPORTS_PER_SOL * SOL_TO_SEND,
});
 
transaction.add(sendSolInstruction);
 
const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);
 
console.log(
  `💸 Finished! Sent ${SOL_TO_SEND} SOL to the address ${toPubkey}. `,
);
console.log(`Transaction signature is ${signature}!`);