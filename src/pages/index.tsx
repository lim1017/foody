// pages/index.tsx
import BottomNav from "@/components/BottomNav";
import Map from "@/components/Map";
import Head from "next/head";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Foodie App</title>
        <meta
          name="description"
          content="Discover the best places to eat from top food influencers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow p-4">
        <div className="container mx-auto">
          <input
            type="text"
            placeholder="Search for places..."
            className="w-full p-2 border border-gray-200 rounded"
          />
        </div>
        <nav className="flex justify-around">
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Friends
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Favourites
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Type
          </a>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto bg-gray-100 rounded-lg h-full">
          <Map />
        </div>
      </main>
    </div>
  );
};

export default Home;