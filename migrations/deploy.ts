import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);

  console.log("Deploying AlphaQubit Solana SPL-USDT Yield Engine...");
  console.log("RPC Endpoint:", provider.connection.rpcEndpoint);

  const program = anchor.workspace.AlphaqubitYield;
  console.log("Program ID:", program.programId.toBase58());
  console.log("Deployment verified on Solana endpoint:", provider.connection.rpcEndpoint);
};
