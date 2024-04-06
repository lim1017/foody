import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-captions-scraper";

export const GET = async (req, res) => {
  console.log("in get route");
  try {
    getSubtitles({
      videoID: "SUwpEMh1uwM", // youtube video id
      lang: "en", // default: `en`
    }).then((captions) => {
      console.log(captions);
    });

    return NextResponse.json("Success!", { status: 200 });
  } catch (error) {
    console.error(error, "eeeeeeeeeeeeerrrrorrr");
    return NextResponse.json({ error: "Error fetching vi" }, { status: 500 });
  }
};
