import { NextResponse } from "next/server";
import { google, youtube_v3 } from "googleapis";
import { extractName } from "../services/openai";
import fs from "fs/promises";
import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from "youtube-captions-scraper";

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

  const currentDate = new Date();
  const threeYearsAgo = new Date(currentDate);
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  let pageToken = "";
  const videos: VideoItem[] = [];

  do {
    const response = await youtube.playlistItems.list({
      part: "snippet",
      playlistId: playlistId,
      maxResults: 10, // Maximum allowed by the API
      pageToken: pageToken, //comment out this line if we just want to test the first 2 videos
    });

    const videoList: VideoItem[] = response.data.items;

    const filteredVideoList = filterVideosByLocationsAndDate(
      videoList,
      ["Toronto", "Mississauga", "Richmond Hill", "Vaughan"],
      threeYearsAgo
    );

    for (let i = 0; i < filteredVideoList.length; i++) {
      const videoId = filteredVideoList[i].snippet.resourceId.videoId;

      try {
        if (!videoId) throw "No VideoId";
        const captions = await getSubtitles({
          videoID: videoId,
          lang: "en",
        });
        const stringTranscript = stitchTranscripts(captions);

        filteredVideoList[i].snippet.transcript = stringTranscript;
      } catch (error) {
        console.log("error fetching transcript", videoId, i);

        // const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        // const stringTranscript = stitchTranscripts(transcriptData);
        // filteredVideoList[i].snippet.transcript = stringTranscript;
      }
    }

    videos.push(...filteredVideoList);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return videos;
};

const filterVideosByLocationsAndDate = (
  videos: VideoItem[],
  locations: string[],
  minDate: Date
): VideoItem[] => {
  return videos.filter((video) => {
    const snippet = video.snippet;
    if (!snippet) return false;

    const title = snippet.title || "";
    const description = snippet.description || "";
    const lowerCaseTitle = title.toLowerCase();
    const lowerCaseDescription = description.toLowerCase();

    const publishDate = new Date(snippet.publishedAt);

    return (
      locations.some((location) => {
        const lowerCaseLocation = location.toLowerCase();
        return (
          lowerCaseTitle.includes(lowerCaseLocation) ||
          lowerCaseDescription.includes(lowerCaseLocation)
        );
      }) && publishDate >= minDate
    );
  });
};

const formatFilterData = (data: any) => {
  return data.map((item: any) => {
    return {
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 400),
      thumbnail: item.snippet.thumbnails.high.url,
      videoId: item.snippet.resourceId.videoId,
      transcript: item.snippet.transcript,
    };
  });
};

//fetches playlist items, filters by locations, uses OpenAI to extrat name and location and writes data to a JSON file.  TODO: because LLM output is inconsistant and sometime returns invalid json or incorrect data, create steps we can continue from instead of starting over each time??
export const GET = async (req, res) => {
  // const searchParams = req.nextUrl.searchParams;
  // const channelId = searchParams.get("channelId");
  // const name = searchParams.get('channelName');
  try {
    getData(0);
    return NextResponse.json("Success!", { status: 200 });
  } catch (error) {
    console.error(error, "eeeeeeeeeeeeerrrrorrr");
    return NextResponse.json({ error: "Error fetching vi" }, { status: 500 });
  }
};

export async function getData(index: number = 0) {
  const channelId = "PL-wQeGXw6xB5WDTltGSnXX887hugYbYa1";
  const channelName = "TravelingFoodie";
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;

  try {
    console.log("fetching data for", channelName);
    const videos = await fetchPlaylistItems(channelId, apiKey);
    const videosArr = videos.splice(index);

    console.log(videosArr.length, "found this many videos");

    const formattedRestaurantData = formatFilterData(videosArr);
    console.log("extracting data... for", channelName);
    const restaurantWithNameLocation = await extractName(
      formattedRestaurantData
    );
    console.log(
      restaurantWithNameLocation,
      "restaurantWithNameLocation!!!!!!!!!!!!!"
    );
    const addressPromises = restaurantWithNameLocation.map(
      async (restaurant) => {
        const details = await fetchRestaurantAddress(restaurant);
        console.log(details, "deeeeeeeeeeetailsssss");
        return { ...restaurant, locations: details };
      }
    );

    const dataWithAddress = await Promise.all(addressPromises);

    // Write the data to a JSON file
    await fs.writeFile(
      `./src/app/api/data/${channelName}-${index}.json`,
      JSON.stringify(dataWithAddress, null, 2)
    );
    console.log("Data successfully written to file");
  } catch (error) {
    console.error(error, "Error processing data:");
  }
}

async function fetchRestaurantAddress(restaurant: {
  locations: { city: string; restaurantName: string }[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;
  const client = new Client({});
  const { locations } = restaurant;
  try {
    // Map locations to a list of promises using async operations
    const promises = locations.map(async (location) => {
      const { restaurantName, city } = location;
      const placeIdResponse = await client.findPlaceFromText({
        params: {
          input: `${restaurantName}, ${city}`,
          inputtype: PlaceInputType.textQuery,
          key: apiKey,
          fields: [
            "formatted_address",
            "name",
            "geometry",
            "place_id",
            "types",
          ],
        },
      });

      const placeInfo = placeIdResponse.data.candidates[0] || {};

      return { ...location, geolocation: placeInfo };
    });

    // Wait for all the promises to resolve
    const updatedLocations = await Promise.all(promises);

    return updatedLocations;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}
