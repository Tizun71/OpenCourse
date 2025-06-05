"use client";

import { useState } from "react";
import ContractInteraction from "@/contracts/ContractInteraction";

export default function CertificatePage() {
  const [searchId, setSearchId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSearch = () => {
    setSubmittedId(searchId.trim());
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nhập ID chứng chỉ..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border px-2 py-1 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Tìm
        </button>
      </div>

      {submittedId && <ContractInteraction id={submittedId} />}
    </div>
  );
}
