"use client";
import React from "react";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function ResetButton() {
  const router = useRouter();
  async function ResetNews() {
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    if (data.error) {
      toast({
        title: "Error",
        description: data.error,
      });
    } else {
      toast({
        title: "Success",
        description: data.message,
      });
    }
    //refresh the page
    router.refresh();
  }
  return (
    <Button onClick={ResetNews} variant={"destructive"} size={"sm"}>
      Reset News
    </Button>
  );
}
