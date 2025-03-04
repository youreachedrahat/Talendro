import { emulator } from "@/config/emulator";
import { NETWORK, PROVIDER } from "@/config/lucid";
import { WalletConnection } from "@/context/walletContext";
import { Wallet } from "@/types/cardano";
import {
  Lucid,
  LucidEvolution,
  paymentCredentialOf,
  stakeCredentialOf,
  UTxO,
} from "@lucid-evolution/lucid";

export const mkLucid = async (
  setWalletConnection: (value: React.SetStateAction<WalletConnection>) => void,
  isEmulator?: boolean
): Promise<void> => {
  try {
    let lucidInstance;
    if (isEmulator) {
      lucidInstance = await Lucid(emulator, "Custom");
    } else {
      lucidInstance = await Lucid(PROVIDER, NETWORK);
    }
    setWalletConnection((prev) => ({
      ...prev,
      lucid: lucidInstance,
    }));
  } catch (error) {
    console.error("Error initializing Lucid:", error);
  }
};

export const walletConnect = async (
  setWalletConnection: (value: React.SetStateAction<WalletConnection>) => void,
  wallet: Wallet,
  lucid: LucidEvolution
): Promise<void> => {
  try {
    const api = await wallet.enable();
    lucid.selectWallet.fromAPI(api);

    const address = await lucid.wallet().address();
    const utxos = await lucid.utxosAt(address);
    const balance = walletBalance(utxos);
    const pkh = paymentCredentialOf(address).hash;

    const stakeAddress = (await lucid.wallet().rewardAddress()) ?? "";
    const skh = stakeAddress ? stakeCredentialOf(stakeAddress).hash : "";

    setWalletConnection((walletConnection) => {
      return {
        ...walletConnection,
        wallet,
        address,
        pkh,
        stakeAddress,
        skh,
        balance,
      };
    });
    return;
  } catch (error) {
    console.error("Error Connecting Wallet:", error);
  }
};

function walletBalance(utxos: UTxO[]) {
  let balance = 0n;
  for (const utxo of utxos) {
    balance += utxo.assets.lovelace;
  }
  return Number((Number(balance) / 1_000_000).toFixed(2));
}
