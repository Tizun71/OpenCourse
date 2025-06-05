"use client";
import UserTable from "./components/UserTable";

import UserCreationForm from "@/components/organism/Form/UserCreationForm";
import { useState } from "react";

export default function UserManagement() {
  const [reload, setReload] = useState(false);
  const handleFormSubmit = () => {
    setReload((prev) => !prev);
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">QUẢN LÝ USER</h2>
      </div>
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-4"></div>
        <UserCreationForm onSubmit={handleFormSubmit} />
      </div>
      <div className="px-6">
        <UserTable reload={reload} />
      </div>
    </div>
  );
}
