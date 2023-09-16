import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    const { articleId, comment, username } = request.body;

    try {
      const article = await Article.findById(articleId);

      if (!article) {
        return response.status(404).json({ message: "Article not found" });
      }

      const newComment = {
        username,
        content: comment,
        timestamp: new Date(),
      };

      // Directly push new comment to article's comments array
      article.comments.push(newComment);

      await article.save();

      return response.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (request.method === "GET") {
    const { articleId } = request.query; // Assuming articleId is passed as a query parameter

    try {
      const article = await Article.findById(articleId);

      if (!article) {
        return response.status(404).json({ message: "Article not found" });
      }

      return response.status(200).json(article.comments);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return response.status(405).end();
  }
}
