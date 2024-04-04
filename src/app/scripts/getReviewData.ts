import { google } from "googleapis";
import { promises as fs } from "fs";
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

//chunk array to stay within token limit
const chunkArray = (array: string | any[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export const extractName = async (data: any) => {
  const chunks = chunkArray(data, 5);
  const results = [];

  for (const chunk of chunks) {
    const dataString = JSON.stringify(chunk);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `I am providing you with a json array of objects containing restaurant video reviews with title, description, thumbnail, and videoId. You are to iterate through the array and add the name and location of the restaurant to the object.

          Example Input (JSON):
        [{
          title: 'Barstool Pizza Review - North of Brooklyn Pizzeria (Toronto, ON)',
          description: 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria.',
          thumbnail: 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
          videoId: 'Gvj6eTHxstE'
        }]

        Example Output (JSON):
        [{
          "title": 'Barstool Pizza Review - North of Brooklyn Pizzeria (Toronto, ON)',
          "description": 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria.',
          "thumbnail": 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
          "videoId": 'Gvj6eTHxstE',
          "location": 'Toronto, ON',
          "restaurantName": 'North Of Brooklyn Pizzeria'
        }]


          Here is the data: ${dataString}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const chunkResult: any = completion.choices[0].message.content;
    results.push(...JSON.parse(chunkResult));
  }
  return results;
};

//fetches playlist items, filters by locations, uses OpenAI to extrat name and location and writes data to a JSON file
const getData = async () => {
  const channelId = "UU5PrkGgI_cIaSStOyRmLAKA";
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API_KEY;

  try {
    const videos = await fetchPlaylistItems(channelId, apiKey);

    const videosInToronto = await filterVideosByLocations(videos, [
      "Toronto, ON",
      "Mississauga, ON",
    ]);
    const formattedData = formatYoutubeData(videosInToronto);
    const dataWithName = await extractName(formattedData);

    // Write the data to a JSON file
    await fs.writeFile("data.json", JSON.stringify(dataWithName, null, 2));
    console.log("Data successfully written to file");
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

getData();

async function fetchPlaylistItems(playlistId, apiKey) {
  const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });

  let pageToken = "";
  const videos = [];

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
}

async function filterVideosByLocations(videos, locations) {
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
}

async function formatYoutubeData(data) {
  return data.map((item) => {
    return {
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 300),
      thumbnail: item.snippet.thumbnails.high.url,
      videoId: item.snippet.resourceId.videoId,
    };
  });
}
