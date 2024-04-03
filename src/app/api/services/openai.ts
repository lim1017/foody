import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const chunkArray = (array, size) => {
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
          "restaurentName": 'North Of Brooklyn Pizzeria'
        }]


          Here is the data: ${dataString}.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const chunkResult = completion.choices[0].message.content;
    results.push(...JSON.parse(chunkResult));
  }
  return results;
};
