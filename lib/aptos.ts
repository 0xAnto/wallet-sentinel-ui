import { Account, AccountAddress, Aptos, AptosConfig, Ed25519PrivateKey, Network, NetworkToNetworkName, PrivateKey } from "@aptos-labs/ts-sdk";
const config = new AptosConfig({ network: Network.MAINNET });
export const aptosClient = new Aptos(config);
