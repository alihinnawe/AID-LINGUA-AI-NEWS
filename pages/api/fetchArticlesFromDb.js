import dbConnect from "../../db/connect";

import Article from "../../models/ArticleSchema";

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const articles = await Article.find({});
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
