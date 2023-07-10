import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Ledger from "./Ledger";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [lastLedgerUpdate, setLastLedgerUpdate] = useState(Date.now());

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        address={address}
        setAddress={setAddress}
      />
      
      <Transfer 
        setBalance={setBalance} 
        address={address} 
      />
      /
      <Ledger 
      lastLedgerUpdate = {lastLedgerUpdate}
      setLastLedgerUpdate = {setLastLedgerUpdate}
      />
    </div>
  );
}

export default App;
