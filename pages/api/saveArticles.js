// // pages/api/saveArticles.js
// import dbConnect from "../../db/connect";
// import Article from "../../models/ArticleSchema";

// export default async function handler(request, response) {
//   await dbConnect();
//   console.log("ftechedddddddddd ok");
//   if (request.method === "POST") {
//     try {
//       const ArticleData = request.body;
//       //   console.log("articledataaaaaaaaaaaaaaaaaa ok", ArticleData);

//       for (const singleArticle of ArticleData) {
//         if (
//           singleArticle.author === null ||
//           singleArticle.author === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee1");
//           singleArticle.author = "Unknown Author";
//         }
//         if (
//           singleArticle.urlToImage === null ||
//           singleArticle.urlToImage === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee2");

//           singleArticle.urlToImage =
//             "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg";
//         }
//         if (singleArticle.title === null || singleArticle.title === undefined) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee3");
//           singleArticle.title = "No Title";
//         }

//         if (
//           singleArticle.description === null ||
//           singleArticle.description === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee4");
//           singleArticle.description = "No description";
//         }

//         if (singleArticle.url === null || singleArticle.url === undefined) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee5");
//           singleArticle.url = "No URL";
//         }

//         if (
//           singleArticle.publishedAt === null ||
//           singleArticle.publishedAt === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee6");
//           singleArticle.publishedAt = new Date();
//         }
//         if (
//           singleArticle.content === null ||
//           singleArticle.content === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee7");
//           singleArticle.content = "No content";
//         }
//         if (
//           singleArticle.summary === null ||
//           singleArticle.summary === undefined
//         ) {
//           console.log("trueeeeeeeeeeeeeeeeeeeeeeeeee8");

//           singleArticle.summary = "No summary";
//         }

//         const saveArticle = new Article(singleArticle);
//         await saveArticle.save();
//       }

//       return response.status(201).json({ status: "Article created." });
//     } catch (error) {
//       console.error(error);
//       return response.status(400).json({ error: error.message });
//     }
//   }
//   return response.status(405).json({ message: "Method not allowed" });
// }

// new verion one of the code

// import dbConnect from "../../db/connect";
// import Article from "../../models/ArticleSchema";

// export default async function handler(request, response) {
//   await dbConnect();

//   if (request.method !== "POST") {
//     return response.status(405).json({ message: "Method not allowed" });
//   }

//   try {
//     const ArticleData = request.body;

//     if (!Array.isArray(ArticleData)) {
//       return response
//         .status(400)
//         .json({ error: "Expected an array of articles" });
//     }

//     const validatedArticles = ArticleData.map((singleArticle) => {
//       return {
//         author: singleArticle.author || "Unknown Author",
//         urlToImage:
//           singleArticle.urlToImage ||
//           "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg",
//         title: singleArticle.title || "No Title",
//         description: singleArticle.description || "No description",
//         url: singleArticle.url || "No URL",
//         publishedAt: singleArticle.publishedAt || new Date(),
//         content: singleArticle.content || "No content",
//         summary: singleArticle.summary || "No summary",
//       };
//     });

//     await Article.insertMany(validatedArticles); // Batch insert if your ORM supports it

//     return response.status(201).json({ status: "Articles created." });
//   } catch (error) {
//     console.error(error);
//     return response.status(400).json({ error: error.message });
//   }
// }

import dbConnect from "../../db/connect";
import Article from "../../models/ArticleSchema";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {
    const ArticleData = request.body;

    if (!Array.isArray(ArticleData)) {
      return response
        .status(400)
        .json({ error: "Expected an array of articles" });
    }

    let newArticleCount = 0;

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
