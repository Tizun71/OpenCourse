"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen } from "lucide-react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { abi, client } from "@/lib/thirdwebClient";
import Image from "next/image";
import axios from "axios";
import { sepolia } from "thirdweb/chains";

import { getContract, readContract } from "thirdweb";
import { CONTRACT_ADDRESS } from "@/constants/BlockchainConstant";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
interface Certificate {
  id: number;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  contractAddress: string;
}

export default function CertificatesGallery() {
  const account = useActiveAccount();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800 border-green-200";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ADVANCED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [contractAddress, setContractAddress] = useState<string[]>([
    CONTRACT_ADDRESS,
  ]);

  const fetchNFTs = async () => {
    if (!account) return;
    console.log(contractAddress);
    try {
      const userCertificates: any[] = [];
      for (
        let addressIndex = 0;
        addressIndex < contractAddress.length;
        addressIndex++
      ) {
        const contract = getContract({
          client,
          chain: sepolia,
          address: contractAddress[addressIndex],
          abi: abi,
        });
        const balance = await readContract({
          contract,
          method: "balanceOf",
          params: [account.address],
        });

        for (let i = 0; i < Number(balance); i++) {
          const tokenId = await readContract({
            contract,
            method: "tokenOfOwnerByIndex",
            params: [account.address, BigInt(i)],
          });

          console.log(Number(tokenId));

          const uri = await readContract({
            contract,
            method: "tokenURI",
            params: [tokenId],
          });
          const res = await axios.get(
            uri.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          userCertificates.push({
            id: Number(tokenId),
            ...res,
            contractAddress: contractAddress[addressIndex],
          });
          console.log(userCertificates[i]);
        }
      }

      setCertificates(userCertificates);
    } catch (err) {
      console.error("Error loading NFTs:", err);
      contractAddress.pop();
      toast.error("Địa chỉ không tuân theo đúng tiêu chuẩn");
    }
  };

  useEffect(() => {
    if (account) {
      fetchNFTs();
    } else {
      setCertificates([]);
    }
  }, [account, contractAddress]);
  const [newAddress, setNewAddress] = useState("");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {contractAddress.map((addr) => (
            <Badge key={addr} className="mr-2">
              {addr}
            </Badge>
          ))}
        </div>
        <div className="ml-6">
          <div className="flex justify-center gap-3">
            <Input
              placeholder="Nhập địa chỉ 0x"
              className="w-100"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />

            <Button
              className="mr-2"
              onClick={() => {
                setContractAddress([...contractAddress, newAddress]);
                setNewAddress("");
              }}
            >
              Thêm địa chỉ
            </Button>
            <ConnectButton client={client} />
          </div>
        </div>
      </div>

      {account ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">
              Wallet đã được kết nối thành công!
            </span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Bạn có thể xem và quản lý tất cả NFT certificates trong wallet của
            mình.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-800 font-medium">
              Vui lòng kết nối Wallet để xem chứng chỉ!
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Bạn cần kết nối đến Wallet để xem tất cả chỉ của bạn ở Open Course
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {certificates.map((certificate) => {
          const attributes = Array.isArray(certificate.attributes)
            ? certificate.attributes
            : [];
          const courseName =
            attributes.find((attr) => attr.trait_type === "Course Name")
              ?.value || "";
          const category =
            attributes.find((attr) => attr.trait_type === "Category")?.value ||
            "";
          const level =
            attributes.find((attr) => attr.trait_type === "Level")?.value || "";
          const issuedAt =
            attributes.find((attr) => attr.trait_type === "IssuedAt")?.value ||
            "";
          const instructor =
            attributes.find((attr) => attr.trait_type === "Instructor")
              ?.value || "";

          return (
            <Card
              key={certificate.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group p-0"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={certificate.image || "/placeholder.svg"}
                  alt={certificate.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                  width={500}
                  height={500}
                />
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                      {courseName}
                    </h3>
                    <Badge className={`ml-2 ${getLevelColor(level)} text-xs`}>
                      {level}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{category}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(issuedAt)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 w-full mt-4 gap-3 h-fit">
                    <a
                      href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${courseName}&organizationName=${"Open Course"}&certUrl=https://sepolia.etherscan.io/address/${
                        certificate.contractAddress
                      }&certId=${certificate.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/linkedIn.png"
                        alt="LinkedIn Add to Profile button"
                        width="500"
                        height="500"
                        className="mt-1"
                      />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
