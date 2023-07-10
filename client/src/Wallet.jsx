import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function getAddress(publicKey){
  const keySlice = publicKey.slice(1);
  const keyHash = keccak256(keySlice);
  return toHex(keyHash.slice(keyHash.length - 20));
}

function Wallet({ address, setAddress, privateKey, setPrivateKey, balance, setBalance }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = getAddress(secp.secp256k1.getPublicKey(privateKey));
    setAddress(address);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="address">
        ADDRESS: {address}
      </div>

      <div className="balance">Balance: {balance}</div>


    </div>
  );
}

export default Wallet;
