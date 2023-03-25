import { useState, useEffect } from "react";

// Components
import { addBalanceOwner,addBalanceCounterparty, revert, claimCounterparty, claimOwner } from "./utils/operation";
import { fetchStorage } from "./utils/tzkt";
import { connectWallet, getAccount } from "./utils/wallet";

const App = () => {

    const [depositValue, setDepositValue] = useState(0);
    const [hashValue, setHashValue] = useState([])
    const [account, setAccount] = useState("");
    const [owner, setOwner] = useState("");
    const [counterparty, setCounterparty] = useState("")
    const [ownerWidthdraw, setownerWidthdraw] = useState(localStorage.getItem('ownerWidthdraw') === 'true');
    const [counterpartyWidthdraw, setCounterpartyWidthdraw] = useState(localStorage.getItem('counterpartyWidthdraw') === 'true')
    const [admin, setAdmin] = useState("")

    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true')
    const [isOwner, setIsOwner] = useState(localStorage.getItem('isOwner') === 'true')
    const [isCounterparty, setIsCounterparty] = useState(localStorage.getItem('isCounterparty') === 'true')

  useEffect(() => {

    (async () => {
      const storage = await fetchStorage();
      setOwner(storage.owner);
      setCounterparty(storage.counterparty);
      setAdmin(storage.admin);

      const activeAccount = await getAccount();
      setAccount(activeAccount);

      if (activeAccount == admin){
        setIsAdmin(true);
        setIsOwner(false);
        setIsCounterparty(false);
      }
      else if (activeAccount == owner){
        setIsAdmin(false);
        setIsOwner(true);
        setIsCounterparty(false);
      }
      else if (activeAccount == counterparty){
        setIsAdmin(false);
        setIsOwner(false);
        setIsCounterparty(true);
      }

      console.log("Admin, Owner, Counterparty: ",isAdmin, isOwner, isCounterparty)

      localStorage.setItem('ownerWidthdraw', ownerWidthdraw);
      localStorage.setItem('counterpartyWidthdraw', counterpartyWidthdraw);

      console.log("account: ", account)
      console.log("ownerWidthdraw: ", ownerWidthdraw);
      console.log("counterpartyWidthdraw: ", counterpartyWidthdraw, account);

    })();
  }, [ownerWidthdraw, counterpartyWidthdraw, account]);

  const onConnectWallet = async () => {
    await connectWallet();
    const activeAccount = await getAccount();
    setAccount(activeAccount);

  };

  // Depositing the balance for owner and counterparty
  const onDeposit = async (event) => {
    event.preventDefault();
    const amount = depositValue ? parseInt(depositValue) : 0;
    console.log(`Input value: ${amount}`);
    console.log(owner)
    console.log(account)
    console.log(account == owner);
    
    try{
      if (account == owner){
        console.log("adding balance to owner")
        await addBalanceOwner(amount)
        alert("Owner Transaction Successful")
      }
      else if (account === counterparty){
        console.log("adding balance to counterparty")
        await addBalanceCounterparty(amount)
        alert("Counterparty Transaction Successful")
      }
      
    }
    catch(err){
      alert("Transaction failed: ", err.message);
    }

  };

  // Setting the values if the people want to widthdraw
  const onWidthdraw = async (event) => {
    event.preventDefault();

    if (account == owner){
      console.log("owner is widthdrawing")
      setownerWidthdraw(!ownerWidthdraw)
      console.log(ownerWidthdraw)
    }
    else if (account === counterparty){
      console.log("counterparty is widthdrawing")
      setCounterpartyWidthdraw(!counterpartyWidthdraw)
      console.log(counterpartyWidthdraw)
    }

  };

  const onRevert = async (event) => {
    event.preventDefault();

    try{
      console.log("trying to revert balance")
      await revert(ownerWidthdraw, counterpartyWidthdraw)
      alert("reverted balance successfully")
    }
    catch(err){
      alert("Transaction failed: ", err.message);
    }

  };

  const onClaim = async(event) => {
    event.preventDefault();

    const encoder = new TextEncoder();
    const hash = encoder.encode(hashValue);
    console.log(hash);

    console.log(hash)


    try{
      if (account == owner){
        await claimOwner()
        alert("Owner Claim Successful")


      }
      else if (account == counterparty){

        console.log("claiming counterparty")
        await claimCounterparty(hash)
        alert("Counterparty Claim Successful")

      }
    }
    catch(err){
      alert("Transaction failed: ", err.message);
    }
  }; 

  const handleDepositChange = (event) => {
    setDepositValue(event.target.value);
    console.log(depositValue)
  };

  const handleHashChange = (event) => {
    setHashValue(event.target.value)
    console.log(hashValue)
  };

  return (
    <div className="h-100">
      <div>
        <div className="navbar navbar-dark bg-dark">
          <div className="container py-2">
            <a href="/" className="navbar-brand">
              Tezos Escrow
            </a>
            <div className="d-flex">
              {/* TODO 4.b - Call connectWallet function onClick  */}
              <button onClick={onConnectWallet} className="btn btn-outline-info">
                {/* TODO 5.a - Show account address if wallet is connected */}
                { account !=="" ? account : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="wrapper center">

      <div class="card">
        <div class="card-body">
          <form>
            {isOwner && <h3>Hi, Owner!</h3>}
            {isAdmin && <h3>Hi, Admin!</h3>}
            {isCounterparty && <h3>Hi, Counterparty!</h3>}

            {(isOwner || isCounterparty) &&
              <div class="form-group mb-2">
                <input type="number" class="form-control" pattern="[0-9]*" placeholder="Number of tickets to purchase" value={depositValue} onChange={handleDepositChange}  />
              </div>
            }
            
            {isCounterparty &&
                <div class="form-group mb-2">
                  <input type="text" class="form-control" placeholder="Hash" value={hashValue} onChange={handleHashChange}  />
                </div>
            }

            <div class = "center">
              {/* show if owner or counterparty */}
              {(isOwner || isCounterparty) &&
                <button onClick={onDeposit} className="btn btn-primary btn-lg ">
                  Deposit
                </button>
              }

              {/* show if owner or counterparty */}
              {(isOwner || isCounterparty) &&
                <button onClick={onClaim} className="btn btn-primary btn-lg ">
                  Claim
                </button>
              }

              {/* show if owner or counterparty */}
              {(isOwner || isCounterparty) &&
                <button onClick={onWidthdraw}  className="btn btn-primary btn-lg ">
                  {((isOwner && ownerWidthdraw) || (isCounterparty && counterpartyWidthdraw)) ?
                    "Unwidthdraw"
                    :
                    "Widthdraw"
                  }

                </button>
              }
              

              {/* show if admin */}
              {isAdmin &&
                  <button onClick={onRevert} className="btn btn-primary btn-lg ">
                    Revert
                   </button>
              }
              
            </div>  
            
          </form>
        </div>
      </div>

       
      </div>
    </div>

  );
};

export default App;
