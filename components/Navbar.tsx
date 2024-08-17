import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { toast } from "./ui/use-toast";
import ResetButton from "./ResetButton";
export default async function Navbar() {
  const user = await currentUser();

  return (
    <nav className="px-5 py-8 bg-blue-500 shadow-sm shadow-white flex flex-row justify-center sm:justify-between space-y-5 items-center flex-wrap ">
      <Link href={"/"} className="font-bold text-white text-lg cursor-pointer ">
        SomeNewsWebsite
      </Link>
      {user ? (
        <div className="flex flex-row items-center gap-5">
          <Button asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <ResetButton />
          <UserButton />
        </div>
      ) : (
        <div className="flex flex-row items-center gap-5">
          <Button asChild>
            <Link href={"/sign-in"}>Sign In</Link>
          </Button>
          <Button asChild>
            <Link href={"/sign-up"}>Sign Up</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
