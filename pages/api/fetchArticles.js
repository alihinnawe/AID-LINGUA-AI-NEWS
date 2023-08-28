export default async (req, res) => {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  const selectedCategory = req.query.category || "general";
  const selectedLanguage = req.query.language || "en";

  try {
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=${selectedCategory}&language=${selectedLanguage}&apiKey=${NEWS_API_KEY}`
    );
    const newsData = await newsResponse.json();
    res.status(200).json(newsData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching articles." });
  }
};
