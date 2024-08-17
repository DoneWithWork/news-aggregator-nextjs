import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { PreferenceForm } from "@/components/Form";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/prisma/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NewsAggregator",
  description: "Get all your news in one place",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-[#181818]  relative`}>
          <Navbar />

          <main>{children}</main>
          <footer className="bottom-0 a px-2 py-2">
            <p className="text-white">&copy; DoneWithWork 2024</p>
          </footer>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
