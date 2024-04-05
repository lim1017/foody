import React, { useState } from "react";
import Map from "@/components/MapComponents/Map";
import TopNav from "@/components/TopNav";
import Head from "next/head";

const Home = () => {
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);

  console.log(mapMarkers, "mapMarkers");
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

      <header className="bg-white shadow p-2">
        <div className="container mx-auto">
          <input
            type="text"
            placeholder="Search for places..."
            className="w-full p-2 border border-gray-200 rounded"
          />
        </div>
        <TopNav setMapMarkers={setMapMarkers} />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto bg-gray-100 rounded-lg h-full">
          <Map mapMarkers={mapMarkers} />
        </div>
      </main>
    </div>
  );
};

export default Home;
