import Navbar from "@/components/Navbar";
import React from "react";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1 className="font-bold text-3xl mt-20 text-white text-center">
          All your news in one page
        </h1>
        <p className="text-white font-semibold max-w-[50ch]">
          Welcome to SomeNewsWebsite, where you can get all your news in one
          page. Choose from a variety of news sources and categories to curate
          the content you
          <span className="text-red-500 font-semibold text-lg mx-2">love</span>
        </p>
      </div>
    </div>
  );
}
