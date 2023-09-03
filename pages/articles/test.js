// import dbConnect from "../../../db/connect";
// import Article from "../../../models/ArticleSchema";

// export default async function handler(req, res) {
//   try {
//     await dbConnect();

//     // console.log("idddddddddddddddddddddddddS,", req.query.id);
//     const _id = req.query.id;

//     const updatedArticle = await Article.findByIdAndUpdate(
//       _id,
//       {
//         $inc: { likes: 1 }, // Increment 'likes' by 1
//       },
//       {
//         new: true, // Return the updated document
//       }
//     );

//     // Check if article was found and updated
//     if (!updatedArticle) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Article not found" });
//     }

//     // console.log("response is eeeeeeeeee", res);

//     // Return the updated article as a response
//     return res.status(200).json({ success: true, data: updatedArticle });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "An error occurred" });
//   }
// }
// console.log("test")
console.log("test");
