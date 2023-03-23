// TODO 1 - Setup Tezos Toolkit
import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet"
// import { getAccount } from "./wallet";

export const tezos = new TezosToolkit("https://ghostnet.smartpy.io")

// TODO 3 - Specify wallet provider for Tezos instance
tezos.setWalletProvider(wallet);

// // Get the balance of an account
// export const getBalance = async () =>  {
//     const accountAddress = await getAccount();
//     try {
//         const balance = await tezos.tz.getBalance(accountAddress);
//         console.log(`Balance of ${accountAddress}: ${balance.toNumber() / 1000000} ꜩ`);
//         const newBalance = balance.toNumber() / 1000000;
//         console.log(newBalance);
//         return newBalance;
//     } catch (error) {
//         console.error(error);
//     }
//   }