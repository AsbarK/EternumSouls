import { Transaction, SystemProgram, Keypair, Connection, PublicKey } from "@solana/web3.js";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } from '@solana/spl-token';
import { DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';
import { bundlrStorage, findMetadataPda, keypairIdentity, Metaplex, UploadMetadataInput } from '@metaplex-foundation/js';
import secret from './guideSecret.json';

const MY_TOKEN_METADATA: UploadMetadataInput = {
    name: "Eternumsouls",
    symbol: "SOUL",
    description: "This is a SOUL token!",
    image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp7832355.jpg&tbnid=jo7Rtu92zh9_UM&vet=12ahUKEwiomJfEuI3_AhUmHLcAHUp8AkIQMygDegUIARD6AQ..i&imgrefurl=https%3A%2F%2Fwallpapercave.com%2Fsoul-reaper-wallpapers&docid=-qDMjc43VK2ttM&w=740&h=1081&q=soul%20reaper%20images&ved=2ahUKEwiomJfEuI3_AhUmHLcAHUp8AkIQMygDegUIARD6AQ" //add public URL to image you'd like to use
}

const endpoint = 'http://127.0.0.1:8899'; //Replace with your RPC Endpoint
const solanaConnection = new Connection(endpoint);
const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name, 
    symbol: MY_TOKEN_METADATA.symbol,
    uri: 'TO_UPDATE_LATER',
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
} as DataV2;
/**
 * 
 * @param wallet Solana Keypair
 * @param tokenMetadata Metaplex Fungible Token Standard object 
 * @returns Arweave url for our metadata json file
 */
const uploadMetadata = async(wallet: Keypair, tokenMetadata: UploadMetadataInput):Promise<string> => {
    //create metaplex instance on devnet using this wallet
    const metaplex = Metaplex.make(solanaConnection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: endpoint,
        timeout: 60000,
        }));
    
    //Upload to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
}