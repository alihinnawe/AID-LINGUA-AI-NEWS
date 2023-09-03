// export default async function handler(req, res) {
//   const SMMRY_API_KEY = process.env.SMMRY_API_KEY;
//   const url = req.query.url;
//   console.log("urlllll", url);
//   try {
//     const summaryResponse = await fetch(
//       `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=3&SM_IGNORE_LENGTH=true&SM_WITH_BREAK=true&SM_URL=${encodeURIComponent(
//         url
//       )}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const summaryData = await summaryResponse.json();
//     res.status(200).json(summaryData);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching summary." });
//   }
// }

export default async function handler(req, res) {
  const SMMRY_API_KEY = process.env.SMMRY_API_KEY;
  const url = req.query.url;

  try {
    const summaryResponse = await fetch(
      `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=3&SM_IGNORE_LENGTH=true&SM_WITH_BREAK=true&SM_URL=${encodeURIComponent(
        url
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      res.status(200).json(summaryData);
    } else {
      console.error("Failed to fetch summary:", await summaryResponse.text());
      res
        .status(500)
        .json({ error: "An error occurred while fetching summary." });
    }
  } catch (error) {
    console.error("Error in fetchSummary:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching summary." });
  }
}
// export default async function handler(req, res) {
//   const SMMRY_API_KEY = process.env.SMMRY_API_KEY;
//   const url = req.query.url;
//   console.log("URL:", url);

//   // Check if URL is provided
//   if (!url || url === "null" || url === "undefined") {
//     console.error("URL is not valid:", url);
//     res.status(400).json({ error: "Invalid URL" });
//     return;
//   }

//   try {
//     const summaryResponse = await fetch(
//       `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=3&SM_IGNORE_LENGTH=true&SM_WITH_BREAK=true&SM_URL=${encodeURIComponent(
//         url
//       )}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (summaryResponse.ok) {
//       const summaryData = await summaryResponse.json();

//       // Check if API returned an error
//       if (summaryData.sm_api_error) {
//         console.error("Failed to fetch summary:", summaryData);
//         res.status(500).json(summaryData);
//         return;
//       }

//       res.status(200).json(summaryData);
//     } else {
//       const errorText = await summaryResponse.text();
//       console.error("Failed to fetch summary:", errorText);

//       let parsedError = {};
//       try {
//         parsedError = JSON.parse(errorText);
//       } catch {
//         parsedError = { error: "Unknown error" };
//       }

//       res.status(500).json(parsedError);
//     }
//   } catch (error) {
//     console.error("Error in fetchSummary:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching summary." });
//   }
// }
