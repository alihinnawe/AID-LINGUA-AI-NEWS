import React, { useState, useEffect } from "react";

const categories = [
  "All",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];
const languages = ["en", "de"];
const sortOptions = ["relevancy", "popularity", "publishedAt"];
const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [showSummary, setShowSummary] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("");

  const articlesPerPage = 10;
  // Define the list of sources you want to exclude
  const excludeSources = [
    "Reuters",
    "reuters",
    "Fox News",
    "CNN",
    "Google",
    "google-news",
    "google",
  ];
  const toggleSummary = (index) => {
    setShowSummary((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];

      // Fetch summary if it needs to be shown and hasn't been fetched yet
      if (updated[index] && !articles[index].summary) {
        fetchSummary(articles[index].url, index);
      }

      return updated;
    });
  };

  const fetchSummary = async (url, index) => {
    try {
      // const response = await fetch(
      //   `https://api.smmry.com/?SM_API_KEY=${SMMRY_API_KEY}&SM_LENGTH=${3}&SM_IGNORE_LENGTH=${true}&SM_WITH_BREAK=${true}&SM_URL=${encodeURIComponent(
      //     url
      //   )}`
      // );
      const response = await fetch(
        `/api/fetchSummary?url=${encodeURIComponent(url)}`
      );

      const data = await response.json();
      setArticles((prevState) => {
        const updatedArticles = [...prevState];
        updatedArticles[index].summary = data.sm_api_content;
        return updatedArticles;
      });
    } catch (error) {
      console.error("Failed to fetch summary!", error);
    }
  };
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // const response = await fetch(
        //   `https://newsapi.org/v2/everything?q=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}&apiKey=${NEWS_API_KEY}`
        // );
        const response = await fetch(
          `/api/fetchArticles?category=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}`
        );
        const data = await response.json();
        setArticles(
          data.articles.map((article) => ({ ...article, summary: null }))
        );

        // const articles = articles.filter((article) => {
        //   return !article.url.includes("consent.google.com");
        // });
        // Reset the showSummary state when the category changes
        setShowSummary([]);
      } catch (error) {
        console.error("Failed to fetch articles!", error);
      }
    };
    fetchArticles();
  }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);

  // Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  // const articles1 = articles.filter((article) => {
  //   return !excludeSources.includes(article.source.name);
  // });
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  // console.log("current articles", currentArticles);
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="App">
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
              <input type="date" onChange={(e) => setToDate(e.target.value)} />
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
        </form>{" "}
      </div>
      <div className="articles">
        {currentArticles.map((article, index) => (
          <div className="article" key={index}>
            <input
              type="checkbox"
              className="summaryCheckbox"
              checked={showSummary[index]}
              onChange={() => toggleSummary(index)}
            />
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <h2 className="article-title">{article.title}</h2>
            </a>

            <img
              className="articleImage"
              src={
                article.urlToImage ||
                "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg"
              }
              alt={article.title}
            />

            {showSummary[index] && article.summary && (
              <p className="article-summary">{article.summary}</p>
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
        ))}
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
    </div>
  );
};
export default MainPage;
