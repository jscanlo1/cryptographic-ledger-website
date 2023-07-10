const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey){
    const keySlice = publicKey.slice(1);
    const keyHash = keccak256(keySlice);
    return keyHash.slice(keyHash.length - 20);
}

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log(`Private Key: ${toHex(privateKey)}`);

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log(`Public Key: ${toHex(publicKey)}`);

const address = getAddress(publicKey);
console.log(`Address: ${toHex(address)}`);