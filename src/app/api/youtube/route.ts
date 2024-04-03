import { NextResponse } from "next/server";
import { google, youtube_v3 } from "googleapis";
import { extractName } from "../services/openai";
import fs from "fs/promises";

type VideoItem = youtube_v3.Schema$PlaylistItem;

const fetchPlaylistItems = async (
  playlistId: string,
  apiKey: string | undefined
): Promise<VideoItem[]> => {
  const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });

  let pageToken = "";
  const videos: VideoItem[] = [];

  do {
    const response = await youtube.playlistItems.list({
      part: "snippet",
      playlistId: playlistId,
      maxResults: 50, // Maximum allowed by the API
      pageToken: pageToken,
    });

    videos.push(...response.data.items);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return videos;
};

const filterVideosByLocations = async (
  videos: VideoItem[],
  locations: string[]
): Promise<VideoItem[]> => {
  return videos.filter((video) => {
    const snippet = video.snippet;
    if (!snippet) return false;

    const title = snippet.title || "";
    const description = snippet.description || "";
    const lowerCaseTitle = title.toLowerCase();
    const lowerCaseDescription = description.toLowerCase();

    return locations.some((location) => {
      const lowerCaseLocation = location.toLowerCase();
      return (
        lowerCaseTitle.includes(lowerCaseLocation) ||
        lowerCaseDescription.includes(lowerCaseLocation)
      );
    });
  });
};

const formatYoutubeData = (data: any) => {
  return data.map((item: any) => {
    return {
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 300),
      thumbnail: item.snippet.thumbnails.high.url,
      videoId: item.snippet.resourceId.videoId,
    };
  });
};

//fetches playlist items, filters by locations, uses OpenAI to extrat name and location and writes data to a JSON file
export const GET = async (req, res) => {
  // const searchParams = req.nextUrl.searchParams;
  // const channelId = searchParams.get("channelId");
  // const name = searchParams.get('channelName');
  const channelId = "UU5PrkGgI_cIaSStOyRmLAKA";
  const channelName = "BarStoolPizza";
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;

  try {
    const videos = await fetchPlaylistItems(channelId, apiKey);

    const videosInToronto = await filterVideosByLocations(videos, [
      "Toronto, ON",
      "Mississauga, ON",
    ]);
    const formattedData = formatYoutubeData(videosInToronto);
    const dataWithNameLocation = await extractName(formattedData);

    dataWithNameLocation.forEach((item) => {
      const details = await fetchRestaurantAddress(
        restaurant.restaurentName,
        restaurant.location
      );
      console.log(details);
    });

    // Write the data to a JSON file
    await fs.writeFile(
      `${channelName}.json`,
      JSON.stringify(dataWithNameLocation, null, 2)
    );
    console.log("Data successfully written to file");

    return NextResponse.json("Success!", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching vi" }, { status: 500 });
  }
};

async function fetchRestaurantDetails(restaurantName, location) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const maps = google.maps({
    version: "v3",
    auth: apiKey,
  });

  try {
    // Construct the query for the Places API
    const response = await maps.places
      .queryAutoComplete({
        input: `${restaurantName}, ${location}`,
        // Specify other parameters as needed
      })
      .asPromise();

    // Assuming the first result is the desired one
    const place = response.data.predictions[0];
    if (!place) {
      console.log("No place found for", restaurantName);
      return null;
    }

    // Now get the details
    const detailsResponse = await maps
      .place({
        placeId: place.place_id,
        fields: ["name", "formatted_address", "geometry.location"],
      })
      .asPromise();

    const details = detailsResponse.data.result;
    return {
      name: details.name,
      address: details.formatted_address,
      location: details.geometry.location, // Contains the latitude and longitude
    };
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;
  }
}
