import db from "@/prisma/db";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function News() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  async function ReturnNews() {
    console.log("Getting new news");
    const userPreferences = await db.user.findUnique({
      where: {
        id: user!.id,
      },
      select: {
        preferences: true,
      },
    });

    const preferences = userPreferences?.preferences;
    const prefs = preferences?.toString();

    const news = await fetch(
      `${process.env.MEDIA_STACK_URL}?access_key=${process.env.NEWS_API_KEY}&categories=${prefs}&countries=my,us,gb,sg&sort=popularity`
    );
    const data = await news.json();
    console.log(data);
    const savedUser = await db.user.update({
      where: {
        id: user!.id,
      },
      data: {
        news: data,
      },
    });
    return data;
  }
  async function GetNews() {
    console.log("getting news");

    const userNews = await db.user.findUnique({
      where: {
        id: user!.id,
      },
      select: {
        news: true,
        preferences: true,
      },
    });

    if (!userNews?.preferences || userNews.preferences.length === 0) {
      redirect("/");
    }

    const news = userNews?.news as Prisma.JsonObject;

    if (
      news &&
      Object.keys(news).length > 0 &&
      Array.isArray(news.data) &&
      news.data.length > 0
    ) {
      console.log("returning cached news");
      return news;
    } else {
      console.log("fetching new news");
      const res = await ReturnNews();
      console.log("API response:", res);
      return res || { data: [] };
    }
  }

  const news = await GetNews();

  return (
    <div className="text-white flex flex-col justify-center items-center">
      <p className="my-20 font-bold text-3xl">News</p>
      {news != null && Object.keys(news).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-[80%] mx-auto gap-10">
          {news.data.map((item: any, index: number) => {
            if (item.image != null) {
              return (
                <div
                  key={index}
                  className="border-2 border-white shadow-xl px-3 py-2 space-y-2 flex flex-col justify-between hover:scale-105 transition-transform duration-300 ease-in-out hover:border-yellow-200 rounded-md"
                >
                  <h1 className="font-bold text-lg">{item.title}</h1>
                  <p className="text-sm text-gray-300">
                    {item.description.substring(0, 100) + "..."}
                  </p>
                  <small>{new Date(item.published_at).toDateString()}</small>
                  <small className="font-semibold">{item.source}</small>
                  <img
                    className=" w-full object-cover  h-[200px] "
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={200}
                  />
                  <Link className="text-blue-500 font-semibold" href={item.url}>
                    Read More...
                  </Link>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <p>No news available</p>
      )}
    </div>
  );
}
