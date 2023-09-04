import React, { useState, useEffect } from "react";
import ReadingComprehensionBot from "../../components/ReadingComprehensionBot/";
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
  const DEFAULT_IMAGE_URL =
    "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg";

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Fetch articles from API and save them to the articles collection in Mongo db AIDLingua database.
  useEffect(() => {
    const fetchArticles = async () => {
      try {
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
          .map((article) => ({ ...article, summary: null, likes: 0 }));

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

      // Make the API call to update the likes count of the article
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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>AID LINGUA NEWS APP</h1>
          <div className="filter-container">
            <form className="filter-form">
              <div>
                <label>
                  Category:
                  <select onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Language:
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
                  <button onClick={() => handleLike(article._id)}>
                    {likedArticles[article._id] ? "Unlike" : "Like"}
                  </button>
                  <span>Likes: {article.likes}</span>
                  <input
                    type="checkbox"
                    className="summaryCheckbox"
                    checked={showSummary[article.url] || false}
                    onChange={() =>
                      toggleSummary(article.url, indexOfFirstArticle + index)
                    }
                  />
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

                  {showSummary[article.url] && (
                    <ReadingComprehensionBot SummaryText={article.summary} />
                  )}
                  <a
                    href={article.url}
                    className="read-more-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
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
