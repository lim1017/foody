// pages/index.tsx
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
            Home
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Favorites
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Profile
          </a>
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto bg-gray-100 rounded-lg h-full">
          {/* Map or content will go here */}
          <div className="text-red-500">Map will go here</div>
        </div>
      </main>

      <footer className="bg-white shadow p-4">
        <nav className="flex justify-around">
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Home
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Favorites
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            Profile
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
