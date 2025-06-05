const { ethers } = require("hardhat");

async function verify() {
  const message = "123";
  const signature =
    "0x304502206d5d77d3882c970a57994f3a324a8f6359fd8dd2c7a9c04e1e7ebc0bcb9426cf022100d956bf39abb536afbac90256c7cb34d3f0e63df82baa78c47303809a7b3e7980";
  const publicKey =
    "0x04ff39bec5fb55df625407ce152336fb51cbfcca7bbfaf40a79e19525621f2a83cd4cfa42483b25e09551dcf53565d24a0e1e9f0438ce5e2dd5fa9fad288947184";

  const messageBytes = ethers.toUtf8Bytes(message);
  const messageHash = ethers.keccak256(messageBytes);

  // recoverAddress có thể được gọi trực tiếp
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);

  // Tính address từ publicKey
  const pubKeyBytes = ethers.getBytes(publicKey);
  const addressFromPubKey = ethers.computeAddress(pubKeyBytes);

  console.log("Recovered address:", recoveredAddress);
  console.log("Address from public key:", addressFromPubKey);

  if (recoveredAddress.toLowerCase() === addressFromPubKey.toLowerCase()) {
    console.log("✅ Signature is valid");
  } else {
    console.log("❌ Signature is invalid");
  }
}

verify();
