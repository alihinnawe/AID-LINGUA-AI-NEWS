import mongoose from "mongoose";
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  author: {
    type: String,
    required: true,
    default: "Unknown Author",
  },
  title: {
    type: String,
    required: true,
    default: "no title",
  },
  description: {
    type: String,
    required: true,
    default: "no description",
  },
  url: {
    type: String,
    required: true,
    default: "no url",
    unique: true,
  },
  urlToImage: {
    type: String,
    required: true,
    default:
      "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg",
  },
  publishedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  content: {
    type: String,
    required: true,
    default: "no content",
  },
  summary: {
    type: String,
    required: false,
    default: "no summary",
  },
  likes: {
    type: Number,
    default: 0,
  },
  seen: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    default: "general",
  },
  language: {
    type: String,
    required: true,
    default: "en",
  },
});

ArticleSchema.index({
  title: "text",
  description: "text",
  content: "text",
  author: "text",
});

const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
