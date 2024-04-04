import BarStoolPizza from "../data/BarStoolPizza.json";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const searchParams = req.nextUrl.searchParams;

  const channelName = searchParams.get("channelName");

  let data;
  switch (channelName) {
    case "BarStoolPizza":
      data = BarStoolPizza;
      break;
    default:
      res.status(404).json({ error: "Channel not found" });
      return;
  }

  return NextResponse.json({ data }, { status: 200 });
};
