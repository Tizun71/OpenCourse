"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/homepage");
  }, [router]);

  return <div>Redirecting...</div>;
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
