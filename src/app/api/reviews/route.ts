import BarStoolPizza from "../data/BarStoolPizza.json";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const searchParams = req.nextUrl.searchParams;

  const handle = searchParams.get("handle");

  let data;
  switch (handle) {
    case "BarStoolPizza":
      data = BarStoolPizza;
      break;
    default:
      return NextResponse.json(
        { error: "Error fetching reviews" },
        { status: 500 }
      );
  }

  return NextResponse.json({ data }, { status: 200 });
};
