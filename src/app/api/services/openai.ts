import { OpenAI } from "openai";

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
  console.log(data.length, "data length");
  const chunks = chunkArray(data, 1);
  const results = [];
  console.log(chunks, "chunksssss");
  for (const chunk of chunks) {
    const dataString = JSON.stringify(chunk);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `I am providing you with a json array of objects containing restaurant video reviews with title, description, thumbnail, videoId, and transcript. You are to iterate through the array of videos and perform the following steps

            1. Determine if this is a *single* or *multiple* restaurant review.

            2. CASE 1: if single, parse through the information find the name, location of the restaurant to the object, and a short tagLine.  Also check the transcipt to determine if there is a score or rating.  Output this information in valid JSON format following the example below.

        Example Input:
      [{
        "title": 'Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)',
        "description": 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria.',
        "thumbnail": 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
        "videoId": 'Gvj6eTHxstE',
        "transcript": 'Amazing pizza place, i would give it a score of 8.3'

      Example Output:
      [{
        "title": "Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)",
        "description": "Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria, as well as highly recommended pizza place Piza GiGi",
        "thumbnail": "https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg",
        "videoId": "Gvj6eTHxstE",
        "transcript": 'Amazing pizza place, i would give it a score of 8.3.',
        "locations":[{
          "location": "Toronto, ON",
          "restaurantName": "North Of Brooklyn Pizzeria",
          "tagLine": "Amazing Pizza Place",
          "score": "8.3"
        }]
      }]

        3. CASE 2: if mutiple reviews: we will perform the same steps as above, but create a new object for each restaurant. Output this information in valid JSON format.

        Example Input:
        [{
          "title": 'Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)',
          "description": 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria,after we will checkout one one of the oldest joints in the city.',
          "thumbnail": 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
          "videoId": 'Gvj6eTHxstE',
          "transcript": 'Amazing pizza place, i would give it a score of 8.3.  Next up we are in the annex to checkout Pizza GiGi where the owner has been running the shop for over 40 years, I would give this place a score of 7.1'
  
        Example Output:
        [{
          "title": "Barstool Pizza Review - Toronto Pizza tour (Toronto, ON)",
          "description": "Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria, after we will checkout one one of the oldest joints in the city."
          "thumbnail": "https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg",
          "videoId": "Gvj6eTHxstE",
          "transcript": 'Amazing pizza place, i would give it a score of 8.3.  Next up we are in the annex to checkout Pizza GiGi where the owner has been running the shop for over 40 years, I would give this place a score of 7.1',
          "locations":[
            {
              "location": "Toronto, ON",
              "restaurantName": "North Of Brooklyn Pizzeria",
              "tagLine": "Amazing Pizza Place",
              "score": "8.3"
            },
            {
              "location": "Toronto, ON",
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
      console.log(chunkResult, "extracted!!!!!!!!!!1");
      results.push(...JSON.parse(chunkResult));
    } catch (error) {
      console.log(error);
      //returns partial results
      return results;
    }
  }
  return results;
};
