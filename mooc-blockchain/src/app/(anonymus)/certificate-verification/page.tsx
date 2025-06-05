"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, Search, CheckCircle, XCircle } from "lucide-react";
import CertificateService from "@/services/Backend-api/certificate-service";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { CONTRACT_ADDRESS } from "@/constants/BlockchainConstant";
import { abi, client } from "@/lib/thirdwebClient";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import { getIpfsContentFromTx } from "@/lib/blockchain/utils";

export default function CertificateVerifier() {
  const [txHash, setTxHash] = useState("");
  const [metadataJson, setMetadataJson] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    error?: string;
  } | null>(null);

  const fetchContentByTxHash = async () => {
    if (!txHash.trim()) {
      setValidationResult({
        isValid: false,
        message: "Vui lòng nhập mã giao dịch",
        error: "Mã giao dịch không được để trống",
      });
      setDialogOpen(true);
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC
      );
      const content = await getIpfsContentFromTx(
        txHash,
        CONTRACT_ADDRESS,
        provider
      );
      setMetadataJson(JSON.stringify(content, null, 2));
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: "Lấy nội dung từ giao dịch thất bại",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      });
      setDialogOpen(true);
    }
  };

  const validateMetadataJson = async () => {
    if (!metadataJson.trim()) {
      setValidationResult({
        isValid: false,
        message: "Vui lòng nhập nội dung chứng chỉ",
        error: "Không có dữ liệu để kiểm tra",
      });
      setDialogOpen(true);
      return;
    }

    try {
      JSON.parse(metadataJson);

      const res = await CertificateService.SHA256Converter(metadataJson.trim());
      const hash = "0x" + res.hash;

      const contract = getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS,
        abi: abi,
      });

      const isVerified = await readContract({
        contract,
        method: "verifyCertificate",
        params: [hash as `0x${string}`],
      });

      setValidationResult({
        isValid: isVerified,
        message: isVerified
          ? "Chứng chỉ hợp lệ!"
          : "Chứng chỉ không hợp lệ hoặc chưa được đăng ký trên blockchain.",
      });
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: "JSON không hợp lệ hoặc lỗi khi xác thực",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }

    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg m-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Tìm kiếm theo mã hash giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Nhập mã giao dịch tại đây"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
              <Button onClick={fetchContentByTxHash}>Tìm kiếm</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg m-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Nhập nội dung chứng chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Nhập nội dung metadata tại đây..."
              value={metadataJson}
              onChange={(e) => setMetadataJson(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex gap-3">
              <Button onClick={validateMetadataJson} className="flex-1">
                Kiểm tra chứng chỉ
              </Button>

              <Button
                variant="outline"
                onClick={() => setMetadataJson("")}
                className="flex-shrink-0"
              >
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="text-center">
            <DialogHeader className="flex flex-col items-center justify-center">
              {validationResult?.isValid ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
              <DialogTitle className="my-2 text-3xl">
                {validationResult?.message}
              </DialogTitle>
              {validationResult?.error && (
                <DialogDescription className="text-md mb-2 text-red-600">
                  {validationResult.error}
                </DialogDescription>
              )}
              <Button onClick={() => setDialogOpen(false)} variant="outline">
                Đóng
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
