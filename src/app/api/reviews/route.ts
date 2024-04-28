import BarStoolPizza from "../data/BarStoolPizza.json";
import StrictlyDumping from "../data/StrictlyDumping.json";
import PhilsFoodReview from "../data/PhilsFoodReview.json";
import { NextResponse } from "next/server";
import TravelingFoodie from "../data/TravelingFoodie.json";

const handleToDataMap = {
  BarStoolPizza: BarStoolPizza,
  StrictlyDumping: StrictlyDumping,
  PhilsFoodReview: PhilsFoodReview,
  TravelingFoodie: TravelingFoodie, // Add more mappings as needed
};

export const GET = async (req, res) => {
  const searchParams = req.nextUrl.searchParams;

  const handle = searchParams.get("handle");

  // Check if the handle exists in the map
  if (handle in handleToDataMap) {
    const data = handleToDataMap[handle];
    return NextResponse.json({ data }, { status: 200 });
  } else {
    return NextResponse.json(
      { error: "Error fetching reviews" },
      { status: 500 }
    );
  }
};
