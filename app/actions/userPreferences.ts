"use server";

import db from "@/prisma/db";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});
export async function SetUserPreferences(formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    return { error: "User not found", message: "" };
  }
  const validatedFields = FormSchema.safeParse({
    items: formData.getAll("items"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  console.log(validatedFields.data);
  const userPreferences = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      preferences: {
        set: validatedFields.data.items,
      },
    },
  });
  if (!userPreferences) {
    return { error: "User preferences not set", message: "" };
  }
  console.log(userPreferences);
  revalidatePath("/dashboard");
  return { message: "Preferences set successfully", error: "" };
  // This function is used to set user preferences
}
