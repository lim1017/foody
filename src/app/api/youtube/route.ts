import { NextResponse } from "next/server";
import { google, youtube_v3 } from "googleapis";
import { extractName } from "../services/openai";
import fs from "fs/promises";
import { YoutubeTranscript } from "youtube-transcript";

import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
type VideoItem = youtube_v3.Schema$PlaylistItem;

// Use map to extract the 'text' property from each transcript object to a single string
function stitchTranscripts(transcripts: any[]) {
  const transcriptTexts = transcripts.map((transcript) => transcript.text);

  const combinedText = transcriptTexts.join(" ");

  return combinedText;
}

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

    const videoList = response.data.items;

    const filteredVideoList = await filterVideosByLocations(videoList, [
      "Toronto, ON",
      "Mississauga, ON",
    ]);

    for (let i = 0; i < filteredVideoList.length; i++) {
      const videoId = filteredVideoList[i].snippet.resourceId.videoId;
      try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        const stringTranscript = stitchTranscripts(transcriptData);
        filteredVideoList[i].snippet.transcript = stringTranscript;
      } catch (error) {
        console.error(
          `Failed to fetch transcript for video ID ${videoId}: ${error}`
        );
      }
    }

    videos.push(...filteredVideoList);
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
      transcript: item.snippet.transcript,
    };
  });
};

//fetches playlist items, filters by locations, uses OpenAI to extrat name and location and writes data to a JSON file.  TODO: because LLM output is inconsistant and sometime returns invalid json or incorrect data, need to create steps we can continue from instead of starting over each time
export const GET = async (req, res) => {
  // const searchParams = req.nextUrl.searchParams;
  // const channelId = searchParams.get("channelId");
  // const name = searchParams.get('channelName');

  const channelId = "UU5PrkGgI_cIaSStOyRmLAKA";
  const channelName = "BarStoolPizza";
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;

  try {
    console.log("fetching data for", channelName);
    const videos = await fetchPlaylistItems(channelId, apiKey);

    const formattedRestaurantData = formatYoutubeData(videos);

    console.log("extracting data... for", channelName);
    const restaurantWithNameLocation = await extractName(
      formattedRestaurantData
    );

    const promises = restaurantWithNameLocation.map(async (restaurant) => {
      const details = await fetchRestaurantAddress(restaurant);
      return {
        ...restaurant,
        address: details.formatted_address,
        placeId: details.place_id,
        geometry: details.geometry,
        types: details.types,
      };
    });

    const dataWithAddress = await Promise.all(promises);

    // Write the data to a JSON file
    await fs.writeFile(
      `./src/app/api/data/${channelName}.json`,
      JSON.stringify(dataWithAddress, null, 2)
    );
    console.log("Data successfully written to file");

    return NextResponse.json("Success!", { status: 200 });
  } catch (error) {
    console.error(error, "eeeeeeeeeeeeerrrrorrr");
    return NextResponse.json({ error: "Error fetching vi" }, { status: 500 });
  }
};

async function fetchRestaurantAddress(restaurant: {
  restaurantName: string;
  location: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
  const client = new Client({});
  const { restaurantName, location } = restaurant;
  try {
    const placeIdResponse = await client.findPlaceFromText({
      params: {
        input: `${restaurantName}, ${location}`,
        inputtype: PlaceInputType.textQuery,
        key: apiKey || "",
        fields: ["formatted_address", "name", "geometry", "place_id", "types"],
      },
    });

    const placeInfo = placeIdResponse.data.candidates[0];

    return placeInfo;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}
