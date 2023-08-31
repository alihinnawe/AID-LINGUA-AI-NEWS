import React, { useState, useEffect } from "react";

// this is my main page now. when the user load the app this page should appear.
export default function MainPage() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [showSummary, setShowSummary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState("");

  const articlesPerPage = 10;
  // Define the list of sources you want to exclude

  // const toggleSummary = (url, index) => {
  //   setShowSummary((prev) => {
  //     const updated = { ...prev };
  //     updated[url] = !updated[url];

  //     // Fetch summary if it hasn't been fetched yet
  //     if (updated[url] && !articles[index].summary) {
  //       fetchSummary(url, index);
  //     }

  //     return updated;
  //   });
  // };

  const toggleSummary = async (url, index) => {
    const wasSuccessful = await fetchSummary(url, index);

    if (!wasSuccessful) return; // Do not update the state if fetch was unsuccessful

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

      if (data.sm_api_error === 3) {
        alert("Content too short for summary.");
        return false;
      }
      setArticles((prevState) => {
        const updatedArticles = [...prevState];
        updatedArticles[index].summary = data.sm_api_content;
        return updatedArticles;
      });
      return true; // Fetch successful

      // console.log("daaaaaaaaaaaata:", data);
    } catch (error) {
      console.error("Failed to fetch summary!", error);
    }
  };

  // console.log("articles are:", articles);
  const DEFAULT_IMAGE_URL =
    "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg";
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
          .map((article) => ({ ...article, summary: null }));

        setArticles(filteredArticles);

        // Save to database
        await fetch("/api/saveArticles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredArticles),
        });

        setShowSummary({});
      } catch (error) {
        console.error("Failed to fetch articles!", error);
      }
    };

    fetchArticles();
  }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);
  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/articles?category=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}`
  //       );
  //       const data = await response.json();

  //       const filteredArticles = data.articles
  //         .filter(
  //           (article) => article.urlToImage !== DEFAULT_IMAGE_URL && article.url
  //         ) // Filtering articles
  //         .map((article) => ({ ...article, summary: null }));

  //       setArticles(filteredArticles);

  //       // Reset the showSummary state when the category changes
  //       await fetch("/api/saveArticles", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(filteredArticles),
  //       });
  //       setShowSummary({});
  //     } catch (error) {
  //       console.error("Failed to fetch articles!", error);
  //     }
  //   };
  //   fetchArticles();
  // }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

  // here we should save the articles with summary = null to the database
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
              <input
                type="checkbox"
                className="summaryCheckbox"
                checked={showSummary[article.url] || false}
                onChange={() =>
                  toggleSummary(article.url, indexOfFirstArticle + index)
                }
              />
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h2 className="article-title">{article.title}</h2>
              </a>
              <img
                className="articleImage"
                src={article.urlToImage}
                alt={article.title}
              />
              {showSummary[article.url] && article.summary && (
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
    </div>
  );
}
