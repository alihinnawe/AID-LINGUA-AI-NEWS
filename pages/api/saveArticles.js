import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {
    // collection of data fetched from the newsapi
    const ArticleData = request.body;
    console.log("ArticleData issssssssss:", ArticleData);

    // articles should be an array
    if (!Array.isArray(ArticleData)) {
      return response
        .status(400)
        .json({ error: "Expected an array of articles" });
    }
    // a counter to count how many Articles have been inserted to the artciles collection
    let newArticleCount = 0;

    // insert an article to database
    for (const singleArticle of ArticleData) {
      const articleToSave = {
        author: singleArticle.author || "Unknown Author",
        urlToImage:
          singleArticle.urlToImage ||
          "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg",
        title: singleArticle.title || "No Title",
        description: singleArticle.description || "No description",
        url: singleArticle.url || "No URL",
        publishedAt: singleArticle.publishedAt || new Date(),
        content: singleArticle.content || "No content",
        summary: singleArticle.summary || "No summary",
        likes: singleArticle.likes || 0,
      };

      // Check if the article with the same URL already exists
      const existingArticle = await Article.findOne({ url: articleToSave.url });

      if (!existingArticle) {
        // If it doesn't exist, save the new article
        await new Article(articleToSave).save();
        newArticleCount++;
      }
    }

    return response
      .status(201)
      .json({ status: `Inserted ${newArticleCount} new articles.` });
  } catch (error) {
    console.error(error);
    return response.status(400).json({ error: error.message });
  }
}
