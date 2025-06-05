"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getContract, readContract } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/thirdwebClient";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Wallet, X } from "lucide-react";

const useTokenOwner = (tokenId?: number, contractAddress?: string) => {
  const account = useActiveAccount();
  const [owner, setOwner] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!account || !tokenId || !contractAddress) return;

    const fetchOwner = async () => {
      try {
        const contract = await getContract({
          client,
          chain: sepolia,
          address: contractAddress,
          abi: [
            {
              constant: true,
              inputs: [{ name: "tokenId", type: "uint256" }],
              name: "ownerOf",
              outputs: [{ name: "", type: "address" }],
              stateMutability: "view",
              type: "function",
            },
          ],
        });

        const result = await readContract({
          contract,
          method: "ownerOf",
          params: [BigInt(tokenId)],
        });

        const fetchedOwner = result.toLowerCase();
        const currentUser = account.address.toLowerCase();

        setOwner(fetchedOwner);
        setIsOwner(fetchedOwner === currentUser || fetchedOwner === "");
      } catch (err) {
        console.error("Failed to fetch token owner:", err);
      }
    };

    fetchOwner();
  }, [account, tokenId, contractAddress]);

  return { owner, isOwner };
};

// ============ COMPONENTS ============ //
const StatusMessage = ({
  account,
  isOwner,
}: {
  account: any;
  isOwner: boolean;
}) => {
  if (!account) {
    return (
      <MessageCard
        color="gray"
        icon={<Wallet className="w-4 h-4 text-gray-500" />}
      >
        Vui lòng kết nối ví để kiểm tra vé
      </MessageCard>
    );
  }

  return isOwner ? (
    <MessageCard
      color="green"
      icon={<Check className="w-4 h-4 text-green-500" />}
    >
      Chào mừng đến với sự kiện
    </MessageCard>
  ) : (
    <MessageCard color="red" icon={<X className="w-4 h-4 text-red-500" />}>
      Bạn không phải là chủ nhân của vé này
    </MessageCard>
  );
};

const MessageCard = ({
  children,
  color,
  icon,
}: {
  children: React.ReactNode;
  color: "green" | "red" | "gray";
  icon: React.ReactNode;
}) => (
  <div
    className={`bg-${color}-500 text-white p-4 rounded-lg mb-6 flex items-center justify-center gap-2`}
  >
    <div className="bg-white rounded-full p-1">{icon}</div>
    <span className="font-medium">{children}</span>
  </div>
);

const TicketInfo = ({
  tokenId,
  owner,
  hash,
  ownerName,
}: {
  tokenId: number;
  owner: string;
  hash: string | null;
  ownerName: string | null;
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
          <Image
            src="/logo.png"
            alt="Logo"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Vé thành viên của Open Course
          </h2>
          <p className="text-gray-600">
            <span className="font-medium">ID:</span> {tokenId}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <InfoRow label="Hash:" value={hash ?? "Loading..."} />
        <InfoRow label="Owner:" value={owner ?? "Loading..."} />
        <InfoRow label="Tên người tham dự:" value={ownerName ?? "Loading..."} />
      </div>
    </CardContent>
  </Card>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900 font-mono text-sm">{value}</span>
  </div>
);

// ============ MAIN COMPONENT ============ //
export default function VerificationPage() {
  const searchParams = useSearchParams();
  const contractAddress = "0x0cC83370a556298e9fbabaF5Cd1BaBB1A99cbe99";
  const tokenIdParam = searchParams.get("tokenId");
  const ownerAddress = searchParams.get("ownerAddress") ?? "Loading...";
  const hash = searchParams.get("hash");
  const ownerName = searchParams.get("ownerName");
  const tokenId = tokenIdParam ? Number(tokenIdParam) : undefined;

  const { isOwner } = useTokenOwner(tokenId, contractAddress);
  const account = useActiveAccount();

  if (!contractAddress || !tokenId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Vui lòng cung cấp contractAddress và tokenId trong URL
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <h1 className="text-2xl font-bold text-black">Open Course</h1>
          <ConnectButton client={client} />
        </div>

        <StatusMessage account={account} isOwner={isOwner} />

        <TicketInfo
          tokenId={tokenId}
          owner={ownerAddress}
          hash={hash}
          ownerName={ownerName}
        />
      </div>
    </div>
  );
}
