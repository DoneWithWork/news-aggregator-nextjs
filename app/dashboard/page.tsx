import { PreferenceForm } from "@/components/Form";
import Navbar from "@/components/Navbar";
import News from "@/components/News";
import { Checkbox } from "@/components/ui/checkbox";
import db from "@/prisma/db";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  return (
    <div className=" ">
      {user && user.preferences.length == 0 ? (
        <PreferenceForm></PreferenceForm>
      ) : (
        <Suspense
          fallback={
            <div className="text-3xl font-semi-bold text-center mt-48 text-white">
              Loading...
            </div>
          }
        >
          <News />
        </Suspense>
      )}
    </div>
  );
}
