// TODO 6 - Call buy_ticket entrypoint in the Lottery contract by completing buyTicketOperation
import { tezos } from "./tezos"

// gets the buyTicket operation from the lottery smart contract
export const addBalanceOwner = async (amountDeposit) => {
    try{
        console.log("calling contract, amount to deposit is:" %amountDeposit)
        //get the smart contract from tezos wallet by giving the address of the smart contract
        const contract = await tezos.wallet.at("KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J");
        // get the method addBalanceOwner and add the inputted amount from the front end as the amount here

        console.log("giving the deposit of owner");
        const op = await contract.methods.addBalanceOwner().send(
            {
            amount: amountDeposit,
            mutez: false,
        }
        )
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const addBalanceCounterparty = async (amountDeposit) => {
    try{
        //get the smart contract from tezos wallet by giving the address of the smart contract
        const contract = await tezos.wallet.at("KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J");
        // get the method addBalanceCounterparty and add the inputted amount from the front end as the amount here

        console.log("giving the deposit of counterparty");
        const op = await contract.methods.addBalanceCounterparty().send(
            {
            amount: amountDeposit,
            mutez: false,
        }
        )
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const claimCounterparty = async (secret) => {
    try{
        //get the smart contract from tezos wallet by giving the address of the smart contract
        const contract = await tezos.wallet.at("KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J");

        console.log("giving the deposit of counterparty with code", secret);
        console.log(typeof secret);
        const op = await contract.methods.claimCounterparty(secret).send()
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

export const claimOwner = async () => {
    try{
        //get the smart contract from tezos wallet by giving the address of the smart contract
        const contract = await tezos.wallet.at("KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J");
        // get the method addBalanceCounterparty and add the inputted amount from the front end as the amount here

        console.log("giving the deposit of counterparty");
        const op = await contract.methods.claimOwner().send()
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};


export const revert = async (ownerWidthdraw, counterpartyWidthdraw) => {
    try{
        //get the smart contract from tezos wallet by giving the address of the smart contract
        const contract = await tezos.wallet.at("KT1XruRL66u3a3qFyyh4vD5Df79V4wTHdW3J");
        // get the method addBalanceCounterparty and add the inputted amount from the front end as the amount here

        console.log("giving the deposit of counterparty");
        const op = await contract.methods.revert(ownerWidthdraw, counterpartyWidthdraw).send()
        await op.confirmation(1);
    }
    catch(err){
        throw err;
    }
};

