export default async function handler(req, res) {
  const SMMRY_API_KEY = process.env.EXT_PUBLIC_SMMRY_API_KEY;
  const url = req.query.url;

  try {
    const summaryResponse = await fetch(
      `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=3&SM_IGNORE_LENGTH=true&SM_WITH_BREAK=true&SM_URL=${encodeURIComponent(
        url
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      res.status(200).json(summaryData);
    } else {
      console.error("Failed to fetch summary:", await summaryResponse.text());
      res
        .status(500)
        .json({ error: "An error occurred while fetching summary." });
    }
  } catch (error) {
    console.error("Error in fetchSummary:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching summary." });
  }
}
