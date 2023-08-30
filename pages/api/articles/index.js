export default async function handler(req, res) {
  //fetch newsapi articles variables
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const selectedCategory = req.query.category || "general";
  const selectedLanguage = req.query.language || "en";
  const fromDate = req.query.from;
  const toDate = req.query.to;
  const sortBy = req.query.sortBy;

  // summary smmry api variables
  const SMMRY_API_KEY = process.env.SMMRY_API_KEY;
  const url = req.query.url;

  try {
    try {
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}&apiKey=${NEWS_API_KEY}`
      );
      const newsData = await newsResponse.json();
      res.status(200).json(newsData);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching articles." });
    }

    const summaryResponse = await fetch(
      `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=3&SM_IGNORE_LENGTH=true&SM_WITH_BREAK=true&SM_URL=${encodeURIComponent(
        url
      )}`
    );
    const summaryData = await summaryResponse.json();
    res.status(200).json(summaryData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching summary." });
  }
}
