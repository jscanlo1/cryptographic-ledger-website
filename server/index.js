const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "c9e16345e788a201052dc1e0b7e1995f4c537dec": 100,
  "956c4b12976f651c52cb9b27973339e19dc1249b": 50,
  "bf032f279d69763db9395dbd1e83f21905703745": 75,
};

const ledger = new Map();

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/ledger/:lastLedgerUpdate", (req, res) => {
  // Add funcitonality to only check since last update
  // save on bandwidth
  
  console.log(ledger)
  res.send( ledger );
})


app.post("/send", (req, res) => {
  //TODO: get a signature from client-side application
  //recover the public address from the signature

  //that's the sender...

  const { data , signature } = req.body;
  const {sender, recipient, amount} = data;

  // Hash the message and convert it to hex
  const message = toHex(hashMessage(JSON.stringify(data)))

  // convert the BigInt strings in the signature back too proper BigInts. (have to be converted to ints as axios cant handle big ints)
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);

  // Create a signature object and recover the public key.
  const sig = new secp.secp256k1.Signature(signature.r, signature.s, signature.recovery);
  
  const publicKey = sig.recoverPublicKey(message).toRawBytes();

  //publicKey.toHex()
  // Compare sign to own hash of data to see if its equal
  if(secp.secp256k1.verify(sig, message, publicKey) === false) {
    res.status(400).send({message: "Invalid Signature"});
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  //Check ledger to see if message hash is already sent and processed. Prevetns double spending
  if(ledger.has(message)) {
    res.status(400).send({message: "transaction already processed. No double Spending!"});
    return;
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    ledger.set(message, data);
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function hashMessage(message) {
  const messageBytes = utf8ToBytes(message);
  const messageHash = keccak256(messageBytes);

  return messageHash;
}


