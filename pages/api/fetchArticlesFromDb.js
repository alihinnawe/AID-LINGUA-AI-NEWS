import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";
export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;
  console.log("Query issssssssssssssssssssshhhhhhhhh", query, req);
  switch (method) {
    case "GET":
      // Check if there is a search query
      if (query.query) {
        console.log("TRUEEEEEEEEEEEEEEEEEEEEEEEEEEEE", query.query);
        const searchResults = await Article.find({
          $text: { $search: query.query },
        });
        return res.status(200).json({ success: true, data: searchResults });
      } else {
        // console.log("trueeeeeeeeeeeeeeeeeeeeeeeeDBBBBBBBBBBBfetch");
        // Handle fetching articles with filters
        let filter = {};
        if (query.category && query.category !== "all") {
          filter.category = query.category;
        }

        if (query.language) {
          filter.language = query.language;
        }

        if (query.from && query.to) {
          filter.publishedAt = {
            $gte: new Date(query.from),
            $lte: new Date(query.to),
          };
        }

        let sortOption = {};
        if (query.sortBy) {
          sortOption[query.sortBy] = 1; // 1 for ascending order, -1 for descending
        }

        const articles = await Article.find(filter).sort(sortOption);
        return res.status(200).json({ success: true, data: articles });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
