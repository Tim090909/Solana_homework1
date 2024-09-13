import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getDomainKeySync } from "@bonfida/spl-name-service";

const suppliedDomain = process.argv[2];
if (!suppliedDomain) {
  throw new Error("Provide a .sol domain to check the balance of most famous Solana wellets!");
}
 
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

try{
    let publicKey: PublicKey;

    if(suppliedDomain.endsWith('.sol')){
        console.log(`Resolving domain ${suppliedDomain} to public key...`);
        const {pubkey} = getDomainKeySync(suppliedDomain);
        publicKey = new PublicKey(pubkey);
        console.log(`Resolved public key for ${suppliedDomain}: ${publicKey.toString()}`);
    }else{
        publicKey = new PublicKey(suppliedDomain);

        if (!PublicKey.isOnCurve(publicKey.toBytes())) {
            throw new Error("Invalid wallet address provided!");
        }
    }

    const balanceInLamports = await connection.getBalance(publicKey);
 
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
    
    console.log(
    `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,
    );
}catch(e){
    console.log('Something went wrong!')
    console.error('ERROR:', e.message)
}
