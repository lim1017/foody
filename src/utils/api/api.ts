interface FetcherProps {
  url: string;
  method: string;
  body?: any;
}

export const fetcher = async ({ url, method, body }: FetcherProps) => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(res, "resssssssss");

  if (!res.ok) {
    console.log("in res not ok");
    const error = await res.json();
    console.log(error);
    throw error || "Something went wrong!";
  }
  const data = await res.json();
  return data;
};

export const fetchFoodyData = async (handle: string) => {
  const data = await fetcher({
    url: `/api/reviews?handle=${handle}`,
    method: "GET",
  });
  return data;
};
