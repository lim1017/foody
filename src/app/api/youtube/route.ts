import { NextResponse } from "next/server";
import { google, youtube_v3 } from "googleapis";
import { extractName } from "../services/openai";

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

export const GET = async (req, res) => {
  const searchParams = req.nextUrl.searchParams;
  const channelId = searchParams.get("channelId");

  console.log(channelId, "channelId");
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;

  try {
    const videos = await fetchPlaylistItems(channelId, apiKey);

    const videosInToronto = await filterVideosByLocations(videos, [
      "Toronto, ON",
      "Mississauga, ON",
    ]);
    const formattedData = formatYoutubeData(videosInToronto);
    const dataWithName = await extractName(formattedData);

    console.log(dataWithName, "dataWithName");
    return NextResponse.json(dataWithName, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 }
    );
  }
};
