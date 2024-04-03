export const GET = async (req, res) => {
  const searchParams = req.nextUrl.searchParams;

  const channelName = searchParams.get("channelName");
};
