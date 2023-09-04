import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        let filter = {};
        // Assuming that the articles in the database have a 'category' and 'language' field
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
        // Test category filter
        const articlesByCategory = await Article.find({
          category: query.category,
        });
        const articles = await Article.find(filter).sort(sortOption);

        res.status(200).json({ success: true, data: articles });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
