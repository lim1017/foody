import { OpenAI } from "openai";
import { getData } from "../youtube/route";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

//chunk array to stay within token limit
const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export const extractName = async (data: any) => {
  const chunks = chunkArray(data, 1);
  console.log(chunks.length, "chunks length");
  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    const dataString = JSON.stringify(chunks[i]);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I am providing you with a json array of objects containing restaurant video reviews.  Each video review may contain more than one restaurant.
            
            Each video has a title, description, thumbnail, videoId, and transcript. 
            
            You are to iterate through the array of videos and perform the following steps, Based on the title, description, and transcript, create an array of locations (restaurants in the video), with the following properties: city, restaurantName, score, and tagLine.  
            
            Output this information in valid JSON format following the example below.  Do not include any other text which would create invalid JSON an an output.

        Example Input:
        This example has 2 restaurants: we will perform for each restaurant.

        Example Input:
        [{
          "title": 'Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)',
          "description": 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria,after we will checkout one one of the oldest joints in the city.',
          "thumbnail": 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
          "videoId": 'Gvj6eTHxstE',
          "transcript": 'Amazing pizza place, i would give it a score of 8.3.  Next up we are in the annex to checkout Pizza GiGi where the owner has been running the shop for over 40 years!  this is some old school pizza, I would give this place a score of 7.1'
  
        Example Output:
        [{
          "title": "Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)",
          "description": "Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria, after we will checkout one one of the oldest joints in the city."
          "thumbnail": "https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg",
          "videoId": "Gvj6eTHxstE",
          "transcript": 'Amazing pizza place, i would give it a score of 8.3.  Next up we are in the annex to checkout Pizza GiGi where the owner has been running the shop for over 40 years!  this is some old school pizza, I would give this place a score of 7.1'
          "locations":[
            {
              "city": "Toronto, ON",
              "restaurantName": "North Of Brooklyn Pizzeria",
              "tagLine": "Amazing Pizza Place",
              "score": "8.3"
            },
            {
              "city": "Toronto, ON",
              "restaurantName": "Pizza GiGi",
              "tagLine": "Running for over 40 years!",
              "score": "7.1"
            }
          ]
        }]

        Here is the data: ${dataString}.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      const chunkResult = completion.choices[0].message.content;
      const parsedChunkResult = JSON.parse(chunkResult);
      console.log(parsedChunkResult, "extracted!!!!!!!!!!1");
      parsedChunkResult[0].lastUpdated = Date.now();
      results.push(...parsedChunkResult);
    } catch (error) {
      console.log(error);
      //call the function again with the index to resume
      getData(i);
      //returns partial results
      return results;
    }
  }
  return results;
};
