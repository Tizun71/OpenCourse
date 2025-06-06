import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/provider/Auth/index";
import { LoadingProvider } from "@/provider/Loading";
import { ThirdwebProvider } from "thirdweb/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <LoadingProvider>
            <AuthProvider>
              <main>{children}</main>
            </AuthProvider>
            <Toaster />
          </LoadingProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
