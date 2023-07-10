import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";



function Transfer({ address, setBalance}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {
    evt.preventDefault();

    //Include Timestamps
    const transferData = {
      sender: address,
      amount: parseInt(sendAmount),
      timestamp: Date.now(),
      recipient
    };
    
    

    try {
      const signature = await signMessage(JSON.stringify(transferData), privateKey);
      
      // Convert BigInt to String before sending
      signature.r = signature.r.toString();
      signature.s = signature.s.toString();

      const {
        data: { balance },
      } = await server.post(`send`, {
        data: transferData,
        signature: signature,
      });
      setBalance(balance);
      //Trigger ledger update
    } catch (ex) {
      alert(ex + "\nMessage: " + (ex.response.data.message || null));
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Input a private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

function hashMessage(message) {
  const messageBytes = utf8ToBytes(message);
  const messageHash = keccak256(messageBytes);

  return messageHash;
}

async function signMessage(msg, privateKey) {
  return secp.secp256k1.sign(toHex(hashMessage(msg)), privateKey);
}

export default Transfer;
