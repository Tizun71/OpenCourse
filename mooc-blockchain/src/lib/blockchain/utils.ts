import { ethers } from 'ethers';

function ipfsToHttp(ipfsUri: string): string {
  return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/");
}

export async function getIpfsContentFromTx(
  txHash: string,
  contractAddress: string,
  provider: ethers.providers.JsonRpcProvider
): Promise<any> {
  const transferEventSig = ethers.utils.id("Transfer(address,address,uint256)");

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error("Transaction not found or not mined yet.");
  }

  let tokenId: ethers.BigNumber | null = null;

  for (const log of receipt.logs) {
    if (
      log.address.toLowerCase() === contractAddress.toLowerCase() &&
      log.topics[0] === transferEventSig &&
      log.topics.length === 4
    ) {
      tokenId = ethers.BigNumber.from(log.topics[3]);
      break;
    }
  }

  if (!tokenId) {
    throw new Error("No ERC-721 Transfer event found.");
  }

  const abi = [
    "function tokenURI(uint256 tokenId) public view returns (string)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const ipfsUri: string = await contract.tokenURI(tokenId.toString());
  const ipfsUrl = ipfsToHttp(ipfsUri);

  const res = await fetch(ipfsUrl);
  if (!res.ok) {
    throw new Error("Failed to fetch IPFS content.");
  }

  const metadata = await res.json();
  return metadata;
}
