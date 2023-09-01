// updateArticle.js
import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export async function handler(req, res) {
  await dbConnect();
  console.log("trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1");
  // Check if the request method is PUT
  try {
    // Extract articleId from the request URL

    const { articleId } = req.query;
    console.log("trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2");

    console.log("articleeeeeeeeeeeeeeeeeeeIddddddsss", articleId);
    // Find the article by its ID and increment the likes
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      {
        $inc: { likes: 1 }, // Increment 'likes' by 1
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
