import db from "@/prisma/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const user = await currentUser();
  console.log("User:", user);
  if (!user) {
    console.log("User not found");
    return Response.redirect("/sign-in");
  }
  //fetch the news
  //save news
  const userPreferences = await db.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      preferences: true,
    },
  });

  const preferences = userPreferences?.preferences;
  const prefs = preferences?.toString();
  console.log("Preferences:", prefs);
  console.log(
    `${process.env.MEDIA_STACK_URL}?access_key=${process.env.NEWS_API_KEY}&categories=${prefs}&countries=my,us,gb,sg&sort=popularity`
  );
  const news = await fetch(
    `${process.env.MEDIA_STACK_URL}?access_key=${process.env.NEWS_API_KEY}&categories=${prefs}&countries=my,us,gb,sg&sort=popularity`
  );
  const data = await news.json();
  console.log(data);
  const savedUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      news: data,
    },
  });
  return Response.json({ data: data });
}
