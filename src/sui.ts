import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

export const suiClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: "https://fullnode.mainnet.sui.io:443",
});

export const dAppKit = createDAppKit({
  networks: ["mainnet"],
  createClient: () => suiClient,
  slushWalletConfig: { appName: "Sui Address Attestation" },
});

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
