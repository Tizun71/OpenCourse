"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "./ContractData";
import NFTDetailsPage from "./NFTDetailsCard";
import { CertificateNFT } from "@/interface/Certificate";
import Link from "next/link";

const contractAddress = "0x777dB29F6f2DD3817cC7749a68125912BEe98A5D";
const sepoliaRPC = process.env.NEXT_PUBLIC_SEPOLIA_RPC;

interface ContractInteractionProps {
  id: string;
}

export default function ContractInteraction({ id }: ContractInteractionProps) {
  const [certificate, setCertificate] = useState<CertificateNFT | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readFromContract = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const result = await contract.tokenURI(
        id,
        0x1d294c7e30abbdf87d7e5fb4817edaa25653c3cf
      );
      const ipfsUri = result;

      const ipfsGatewayUrl = ipfsUri.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );

      const response = await fetch(ipfsGatewayUrl);
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu từ IPFS");
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const jsonData = await response.json();
        console.log(jsonData);
        const certificate: CertificateNFT = {
          name: jsonData.name,
          description: jsonData.description,
          image: jsonData.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
          attribute: jsonData.attributes.map(
            (attr: { trait_type: any; value: any }) => ({
              trait_type: attr.trait_type,
              value: attr.value,
            })
          ),
        };
        setCertificate(certificate);
        setCertificateUrl(
          `https://sepolia.etherscan.io/nft/0x777dB29F6f2DD3817cC7749a68125912BEe98A5D/${id}`
        );
      }
    } catch (error: any) {
      console.error("Lỗi khi đọc dữ liệu:", error);
      setError("Không thể tải dữ liệu");
    }
  };

  useEffect(() => {
    if (id) {
      setCertificate(null);
      readFromContract();
    }
  }, [id]);

  return (
    <main className="p-6">
      <Link
        href={
          "https://sepolia.etherscan.io/nft/0x48d0fc315f4d0c6b6674d8f9ef1f19024f338636/" +
          id
        }
        className="text-blue-500"
      >
        Xem trên Scan
      </Link>
      {certificate ? (
        <NFTDetailsPage certificate={certificate} />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
      <p className="text-red-400">{error}</p>
      <div>
        <a
          href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certificate?.name}&organizationName=Open%20Course&certUrl=${certificateUrl}&certId=${id}`}
        >
          {/* <Image
            src="https://download.linkedin.com/desktop/add2profile/buttons/en_US.png "
            alt="LinkedIn Add to Profile button"
            width="500"
            height="500"
          /> */}
        </a>
      </div>
    </main>
  );
}
