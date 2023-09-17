import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    const { articleId, comment, username, email, timestamp } = request.body; // Add email here

    try {
      const article = await Article.findById(articleId);

      if (!article) {
        return response.status(404).json({ message: "Article not found" });
      }

      const newComment = {
        username,
        email,
        content: comment,
        timestamp,
      };

      article.comments.push(newComment);
      await article.save();

      return response.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else if (request.method === "GET") {
    const { articleId } = request.query;

    try {
      const article = await Article.findById(articleId);

      if (!article) {
        return response.status(404).json({ message: "Article not found" });
      }

      // You could map over comments to only send back certain fields
      const filteredComments = article.comments.map(
        ({ username, content, timestamp }) => ({
          username,
          content,
          timestamp,
        })
      );

      return response.status(200).json(filteredComments);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return response.status(405).end();
  }
}
