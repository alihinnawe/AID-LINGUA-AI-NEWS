import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(req, res) {
  await dbConnect();

  // Check if the request method is PUT
  if (req.method !== "PUT") {
    return res.status(405).end(); // Method not allowed
  }

  try {
    // Extract articleId and increment from the request URL
    const { articleId } = req.query;
    const increment = parseInt(req.query.increment, 10) || 1; // If increment is not provided, default to 1

    // Find the article by its ID and change the likes based on the increment value
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        $inc: { likes: increment }, // Increment or decrement 'likes' based on the increment value
      },
      {
        new: true, // Return the updated document
      }
    );

    // Check if article was found and updated
    if (!updatedArticle) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    // Return the updated article as a response
    return res.status(200).json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
}
