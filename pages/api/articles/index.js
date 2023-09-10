export default async function handler(req, res) {
  //fetch newsapi articles variables
  const NEWS_API_KEY = process.env.EXT_PUBLIC_NEWS_API_KEY;
  const selectedCategory = req.query.category;
  const selectedLanguage = req.query.language;
  const fromDate = req.query.from;
  const toDate = req.query.to;
  const sortBy = req.query.sortBy;

  //  the server fetch a list of articles from the API and return it as a response to the client side.
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
}
