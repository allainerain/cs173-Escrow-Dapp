// TODO 2.a - Setup a Beacon Wallet instance
import { BeaconWallet } from "@taquito/beacon-wallet";

//creates a beacon wallet instance
//name of the beacon wallet = Tezos Lottery Dapp
//network of the wallet: ghostnet
export const wallet = new BeaconWallet({
    name: "Tezos Lottery Dapp",
    preferredNetwork: "ghostnet",
})

// TODO 2.b - Complete connectWallet function (for ithacanet)
// Allows you to generate a popup where the user can select which wallet they want to connect to
export const connectWallet = async () => {
    await wallet.requestPermissions({ network: { type: "ghostnet"}});
};


// TODO 2.c - Complete getAccount function
// gets the active account from the wallet client, and returns the address of the account
export const getAccount = async () => {

    const activeAccount = await wallet.client.getActiveAccount();

    if(activeAccount){
        console.log("account taken")
        return activeAccount.address;
    }
    else{
        return "";
    }
};
