import React, { useState, useEffect } from "react";
import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ReadingComprehensionBot from "../../components/ReadingComprehensionBot/";
import ReactWhisper from "../../components/ReactWhisper/";
export default function MainPage() {
  const categories = [
    "all",
    "general",
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
  ];

  const languages = ["en", "de"];
  const sortOptions = ["relevancy", "popularity", "publishedAt"];
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [showSummary, setShowSummary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [likedArticles, setLikedArticles] = useState({});
  const [transcribedText, setTranscribedText] = useState("");

  const articlesPerPage = 10;

  const toggleSummary = async (url, index) => {
    const wasSuccessful = await fetchSummary(url, index);

    if (!wasSuccessful) return;

    setShowSummary((prev) => {
      const updated = { ...prev };
      updated[url] = !updated[url];
      return updated;
    });
  };

  const fetchSummary = async (url, index) => {
    try {
      const response = await fetch(
        `/api/fetchSummary?url=${encodeURIComponent(url)}`
      );

      const data = await response.json();
      if (data.sm_api_error === 4) {
        alert("Content too short for summary.");
        return false;
      }

      setArticles((prevState) => {
        const updatedArticles = [...prevState];
        updatedArticles[index].summary = data.sm_api_content;
        return updatedArticles;
      });
      return true; // Fetch successful
    } catch (error) {
      console.error("Failed to fetch summary!", error);
    }
  };

  // This is a default image for an article only if the fetched article does not have an imageToUrl link.
  const DEFAULT_IMAGE_URL =
    "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg";

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  // Pagination(forward + backward)
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  //  View 10 articles maximum in page
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Fetch articles from API and save them to the articles collection in Mongo db AIDLingua database.
  useEffect(() => {
    // every time the user triggers or click the category, language..., the fetchArticles process is triggrered
    // i.e., new articles only posted into the db collection.
    // i added a restriction if the URL exists in the articles collection,
    //  i.e., ignore posting the article.
    const fetchArticles = async () => {
      try {
        // send a request to the server to in his turn fetch the Api.
        // get an array of maximum articles and return it back to the server.
        // which then send it back to the front end to get rendered in the app main page.
        const response = await fetch(
          `/api/articles?category=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}`
        );
        const data = await response.json();

        // Exclude articles where urlToImage is null, undefined, or empty string
        const filteredArticles = data.articles
          .filter(
            (article) =>
              article.urlToImage &&
              article.urlToImage !== DEFAULT_IMAGE_URL &&
              article.url
          )
          // destructure the articles and add the summary and the likes to each article
          .map((article) => ({ ...article, summary: null, likes: 0 }));

        //  saves (POST) each article to the mongoDB articles collection
        // same here send a request to the server side (saveArticles.js)
        //  the server post the articles to the mongoDB articles collection.
        await fetch("/api/saveArticles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filteredArticles,
            category: selectedCategory,
            language: selectedLanguage,
          }),
        });

        setShowSummary({});
      } catch (error) {
        console.error("Failed to fetch articles!", error);
      }
    };

    fetchArticles();
  }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);

  // Fetch from the internal API when the visitor load the page for the first time
  // before using any filter tool.
  useEffect(() => {
    // here we are getting the articles from the database and no longer rendering the articles from the API.
    // before i used to fetch the articles from API and render them to the homepage.
    // Now, the fetchArticles fetches the articles from the Api, then we save the new or non existing artciles
    // then call the articles back from the articles collection and only render 10 articles per page.
    const fetchDataFromDb = async () => {
      try {
        setIsLoading(true); // <-- set loading to true

        const res = await fetch(
          `/api/fetchArticlesFromDb?category=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}`
        );
        const data = await res.json();

        if (data.success) {
          setArticles(data.data); // setArticles is the state setter for articles
        }
      } catch (error) {
        console.error("Failed to fetch articles from the database!", error);
      } finally {
        setIsLoading(false); // set loading to false regerdles  if fetch was successful or not
      }
    };
    fetchDataFromDb();
  }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);

  useEffect(() => {
    // here we are saving the liked articles into a local storage so that when we refresh the page, the like/Unlike toggle remains.

    const initialLikedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );

    setLikedArticles(initialLikedArticles);
  }, []);

  // Run whenever likedArticles changes to update localStorage
  useEffect(() => {
    if (likedArticles && Object.keys(likedArticles).length > 0) {
      // console.log("Updating localStorage:", likedArticles);
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    }
  }, [likedArticles]);

  const handleLike = async (articleId) => {
    try {
      // Initialize increment value to 1 for liking the article
      let increment = 1;

      // Check if the article is already liked
      if (likedArticles[articleId]) {
        // Change increment to -1 for unliking the article
        increment = -1;
      }

      // Make the API call to update the likes count of the article in the artciles collection for each article.
      // we pass the article id along with the increment to the server side (/api/updateArticles), in his turn update the number of likes for each artcile
      const res = await fetch(
        `/api/updateArticles?articleId=${articleId}&increment=${increment}`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Update the likedArticles state to reflect the new "like" or "unlike" status
        setLikedArticles((prev) => {
          const updated = { ...prev, [articleId]: !prev[articleId] };
          return updated;
        });

        // Update the articles state to reflect the new likes count
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId
              ? { ...article, likes: data.data.likes }
              : article
          )
        );
      } else {
        const text = await res.text(); // the response body
        console.error(`Server responded with an error: ${text}`);
        throw new Error(`Server responded with status ${res.status}`);
      }
    } catch (error) {
      console.error("An error occurred while liking the article:", error);
    }
  };

  return (
    <div className="App">
      {/* if no data keep loading */}
      {isLoading ? (
        <div className="loading-container">
          <div className="glowing-text">Loading...</div>
        </div>
      ) : (
        <>
          <h1>AID LINGUA NEWS APP</h1>
          {/* this div is for the project logo */}
          {/* <div className="container">
            <AidLinguaLogo text="here iam testing" />
          </div> */}

          <div className="filter-container">
            {/* here is where i get the value if the user select the sports category 
            , then the value will be sport*/}
            <form className="filter-form">
              Category:
              <select
                className="Cattegory-select"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div>
                <label>
                  🌐{" "}
                  {/* here is where the Language text is replaced with an emoji */}
                  {/* here is where i get the values either en or de for the language*/}
                  <select onChange={(e) => setSelectedLanguage(e.target.value)}>
                    {languages.map((lang, index) => (
                      <option key={index} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  From:
                  <input
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  To:
                  <input
                    type="date"
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Sort By:
                  <select onChange={(e) => setSortBy(e.target.value)}>
                    {sortOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </form>
          </div>

          <div className="articles">
            {/* viiiiiii: here where i render the list of articles into the app homepage*/}
            {currentArticles.map((article, index) => {
              // Skip rendering the article if it has the default image
              if (
                article.urlToImage ===
                "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg"
              ) {
                return null;
              }

              return (
                <div className="article" key={index}>
                  <span className="like-container">
                    <span
                      className={`like-button ${
                        likedArticles[article._id]
                          ? "like-button--liked"
                          : "like-button--unliked"
                      }`}
                      onClick={() => handleLike(article._id)}
                    >
                      👍
                    </span>
                    <span className="like-count">{article.likes}</span>
                  </span>

                  <div className="summary-control">
                    <span
                      className="summaryToggle"
                      onClick={() =>
                        toggleSummary(article.url, indexOfFirstArticle + index)
                      }
                    >
                      {showSummary[article.url] ? "🔽" : "🔼"}
                    </span>
                    <span
                      className="summaryLabel"
                      onClick={() =>
                        toggleSummary(article.url, indexOfFirstArticle + index)
                      }
                    >
                      {showSummary[article.url]
                        ? "Hide Summary"
                        : "Show Summary"}
                    </span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h2 className="article-title">{article.title}</h2>
                  </a>
                  <img
                    className="articleImage"
                    src={article.urlToImage}
                    alt={article.title}
                  />

                  <a
                    href={article.url}
                    className="read-more-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                  {/* here is where i show or render the summary for a given url below the image of the url. Not only this but also 
                  the user can ask a question based on a reding comprehension text and get answer from 
                  another server implemented in python and listens
                  on another port 5000. The server job is to take the question + summary text
                  then pass it into the deep learning model for Question answering
                  send the results back into the client side and show it below the summaty text.  */}
                  {showSummary[article.url] && (
                    <div className="reading-comprehension-bot">
                      <ReactWhisper setTranscribedText={setTranscribedText} />
                      <ReadingComprehensionBot
                        transcribedText={transcribedText}
                        SummaryText={article.summary}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{`${currentPage} / ${Math.ceil(
              articles.length / articlesPerPage
            )}`}</span>
            <button
              onClick={nextPage}
              disabled={
                currentPage === Math.ceil(articles.length / articlesPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
