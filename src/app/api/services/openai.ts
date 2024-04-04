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
  const chunks = chunkArray(data, 1);
  const results = [];

  for (const chunk of chunks) {
    const dataString = JSON.stringify(chunk);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `I am providing you with a json array of objects containing restaurant video reviews with title, description, thumbnail, videoId, and transcript. You are to iterate through the array of each review and add the name and location of the restaurant to the object.  Also check the transcipt determine the score or rating for the review.  Output in valid JSON format.

          Example Input:
        [{
          "title": 'Barstool Pizza Review - North of Brooklyn Pizzeria (Toronto, ON)',
          "description": 'Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria.',
          "thumbnail": 'https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg',
          "videoId": 'Gvj6eTHxstE',
          "transcript": 'Amazing pizza place, i would give it a score of 8.3'

        Example Output:
        [{
          "title": "Barstool Pizza Review - North of Brooklyn Pizzeria (Toronto, ON)",
          "description": "Dave is in Canada for The Score and the Red Sox Blue Jays game and tries one of the most recommended places in Toronto: North Of Brooklyn Pizzeria.",
          "thumbnail": "https://i.ytimg.com/vi/Gvj6eTHxstE/hqdefault.jpg",
          "videoId": "Gvj6eTHxstE",
          "transcript": 'Amazing pizza place, i would give it a score of 8.3',
          "location": "Toronto, ON",
          "restaurantName": "North Of Brooklyn Pizzeria",
          "score": "8.3"
        }]


          Here is the data: ${dataString}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const chunkResult = completion.choices[0].message.content;
    console.log(chunkResult, "extracted!!!!!!!!!!1");
    results.push(...JSON.parse(chunkResult));
  }
  return results;
};
