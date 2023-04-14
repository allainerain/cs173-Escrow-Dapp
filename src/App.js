import { useState, useEffect } from "react";

// Components
import { addBalanceOwner,addBalanceCounterparty, revert, claimCounterparty, claimOwner } from "./utils/operation";
import { fetchStorage } from "./utils/tzkt";
import { connectWallet, getAccount } from "./utils/wallet";

const App = () => {

    const [depositValue, setDepositValue] = useState(0);
    const [hashValue, setHashValue] = useState([]);
    const [account, setAccount] = useState("");
    const [owner, setOwner] = useState("");
    const [counterparty, setCounterparty] = useState("");
    const [ownerWidthdraw, setownerWidthdraw] = useState(localStorage.getItem('ownerWidthdraw') === 'true');
    const [counterpartyWidthdraw, setCounterpartyWidthdraw] = useState(localStorage.getItem('counterpartyWidthdraw') === 'true');
    const [admin, setAdmin] = useState("");

    const [fromOwner, setFromOwner] = useState("");
    const [fromCounterparty, setFromCounterparty] = useState("");
    const [balanceOwner, setBalanceOwner] = useState("");
    const [balanceCounterparty, setBalanceCounterparty] = useState("");
    const [epoch, setEpoch] = useState("");
    const [formattedEpoch, setFormattedEpoch] = useState("");

    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [isOwner, setIsOwner] = useState(localStorage.getItem('isOwner') === 'true');
    const [isCounterparty, setIsCounterparty] = useState(localStorage.getItem('isCounterparty') === 'true');
    const [ownerDeposited, setOwnerDeposited] = useState(localStorage.getItem('ownerDeposited') === 'true');
    const [counterpartyDeposited, setCounterpartyDeposited] = useState(localStorage.getItem('counterpartyDeposited') === 'true');

  useEffect(() => {

    (async () => {
      const storage = await fetchStorage();
      setOwner(storage.owner);
      setCounterparty(storage.counterparty);
      setAdmin(storage.admin);
      setFromCounterparty(storage.fromCounterparty);
      setFromOwner(storage.fromOwner);
      setBalanceOwner(storage.balanceOwner);
      setBalanceCounterparty(storage.balanceCounterparty);
      setEpoch(storage.epoch);

      const timestamp = new Date(epoch).getTime();
      const formattedTimestamp = new Date(timestamp).toLocaleString();

      setFormattedEpoch(formattedTimestamp);
    

      const activeAccount = await getAccount();
      setAccount(activeAccount);

      if (activeAccount === admin){
        setIsAdmin(true);
        setIsOwner(false);
        setIsCounterparty(false);
      }
      else if (activeAccount === owner){
        setIsAdmin(false);
        setIsOwner(true);
        setIsCounterparty(false);
      }
      else if (activeAccount === counterparty){
        setIsAdmin(false);
        setIsOwner(false);
        setIsCounterparty(true);
      }
      else{
        setIsAdmin(false);
        setIsOwner(false);
        setIsCounterparty(false);
      }

      if(parseInt(balanceOwner) !== 0){
        console.log("setting owner is depositing", balanceOwner !== 0, balanceOwner, typeof balanceOwner);
        setOwnerDeposited(true);
      }
      else{
        console.log("setting not owner is depositing", balanceOwner === 0, balanceOwner, typeof balanceOwner);
        setOwnerDeposited(false);
      }
      if(parseInt(balanceCounterparty) !== 0){
        console.log("setting counterparty is depositing", balanceCounterparty !== 0, balanceCounterparty, typeof balanceCounterparty );
        setCounterpartyDeposited(true);
      }
      else{
        console.log("not setting counterparty is depositing", balanceCounterparty === 0, balanceCounterparty, typeof balanceCounterparty)
        setCounterpartyDeposited(false);
      }

      localStorage.setItem('ownerDeposited', ownerDeposited);
      localStorage.setItem('counterpartyDeposited', counterpartyDeposited);

      localStorage.setItem('ownerWidthdraw', ownerWidthdraw);
      localStorage.setItem('counterpartyWidthdraw', counterpartyWidthdraw);

      console.log("account: ", account)
      console.log("ownerWidthdraw: ", ownerWidthdraw);
      console.log("counterpartyWidthdraw: ", counterpartyWidthdraw, account);
      
      console.log("owner deposited: ", ownerDeposited)
      console.log("counterparty deposited:", counterpartyDeposited)


    })();
  }, [epoch, formattedEpoch, ownerWidthdraw, counterpartyWidthdraw, account, admin, counterparty, isAdmin, isCounterparty, isOwner, owner, balanceOwner, balanceCounterparty, ownerDeposited, counterpartyDeposited]);

  const onConnectWallet = async () => {
    await connectWallet();
    const activeAccount = await getAccount();
    setAccount(activeAccount);

  };

  // Depositing the balance for owner and counterparty
  const onDeposit = async (event) => {


    event.preventDefault();
    const storage = await fetchStorage();
    const amount = depositValue ? parseInt(depositValue) : 0;
    console.log(`Input value: ${amount}`);
    console.log(owner)
    console.log(account)
    console.log(account === owner);
    
    try{
      if (account === owner){
        console.log("adding balance to owner")
        await addBalanceOwner(amount)
        alert("Owner Transaction Successful")
        setBalanceOwner(storage.balanceOwner)
        window.location.reload();
      }
      else if (account === counterparty){
        console.log("adding balance to counterparty")
        await addBalanceCounterparty(amount)
        alert("Counterparty Transaction Successful")
        setBalanceCounterparty(storage.balanceCounterparty)
        window.location.reload();
      }
      
    }
    catch(err){
      alert("Transaction failed: ", err.message);
    }

  };

  // Setting the values if the people want to widthdraw
  const onWidthdraw = async (event) => {
    event.preventDefault();

    if (account === owner){
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
      console.log("trying to revert balance");
      await revert(ownerWidthdraw, counterpartyWidthdraw);
      alert("reverted balance successfully");
      setEpoch("");
    }
    catch(err){
      alert("Transaction failed: ", err.message);
    }

  };

  const onClaim = async(event) => {
    event.preventDefault();

    const encoder = new TextEncoder();
    const hash = encoder.encode(hashValue);

    try{
      if (account === owner){
        await claimOwner()
        alert("Owner Claim Successful")
        setEpoch("");
        window.location.reload();
      }
      else if (account === counterparty){
        console.log("claiming counterparty")
        await claimCounterparty(hash)
        alert("Counterparty Claim Successful")
        setEpoch("");
        window.location.reload();

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
            {!isOwner && !isAdmin && !isCounterparty && <h3>Connect a Wallet!</h3>}
            {isOwner && 
              <div>
              <h3>Hi, Owner!</h3> 
              { ownerDeposited ?  <p>You have already deposited</p> : <p>You need to deposit {fromOwner/1000000} tez.</p>}
              {/* {(balanceOwner === 0) && <p>You need to deposit {fromOwner/1000000} tez.</p>} */}
              {/* <p>You need to deposit {fromOwner/1000000} tez.</p> */}
              </div>
              }

            {isAdmin && <h3>Hi, Admin!</h3>}
            {isCounterparty && 
            
            <div>
              <h3>Hi, Counterparty!</h3> 
              {counterpartyDeposited ? <p>You have already deposited.</p> : <p>You need to deposit {fromCounterparty/1000000} tez.</p>}
              {/*{(balanceCounterparty === 0) && <p>You need to deposit {fromCounterparty/1000000} tez.</p>} */}
              {/* <p>You need to deposit {fromCounterparty/1000000} tez.</p> */}
            </div>
            
            }

            {((isOwner && !ownerDeposited) || (isCounterparty && !counterpartyDeposited)) &&
              <div class="form-group mb-2">
                <input type="number" class="form-control" pattern="[0-9]*" placeholder="Amount to deposit" value={depositValue} onChange={handleDepositChange}  />
              </div>
            }
            
            {(isCounterparty && (counterpartyDeposited) && ownerDeposited) &&
                <div class="form-group mb-2">
                  <input type="password" class="form-control" placeholder="Hash" value={hashValue} onChange={handleHashChange}  />
                </div>
            }

            <div class = "center">
              {/* show if owner or counterparty */}
              {((isOwner && !ownerDeposited) || (isCounterparty && !counterpartyDeposited)) &&
                <button onClick={onDeposit} className="btn btn-primary btn-lg ">
                  Deposit
                </button>
              }

              {/* show if owner or counterparty */}
              {((isOwner || isCounterparty) && (ownerDeposited) && (counterpartyDeposited)) &&
                <button onClick={onClaim} className="btn btn-primary btn-lg ">
                  Claim 
                  
                  {(isOwner && " after ")}
                  {(isCounterparty) && " before "}
                  
                  {formattedEpoch}
                </button>
              }

              {/* show if owner or counterparty */}
              {((isOwner && ownerDeposited) || (isCounterparty && (counterpartyDeposited))) &&
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
              <div>
                {ownerWidthdraw ? <p>Owner wants to widthdraw.</p> : <p>Owner doesn't want to widthdraw.</p>}
                {counterpartyWidthdraw ? <p>Counterparty wants to widthdraw.</p> : <p>Counterparty doesn't want to widthdraw.</p>}
                <button onClick={onRevert} className="btn btn-primary btn-lg ">
                  Revert
                </button>

              </div>
                  
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
