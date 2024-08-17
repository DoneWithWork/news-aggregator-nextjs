import db from "@/prisma/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "User not found", message: "" });
  }

  const deletePref = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      news: {},
    },
  });
  console.log(deletePref);
  if (!deletePref) {
    return Response.json({ error: "News not reset", message: "" });
  }
  revalidatePath("/dashboard");
  return Response.json({ message: "News reset successfully", error: "" });
}
