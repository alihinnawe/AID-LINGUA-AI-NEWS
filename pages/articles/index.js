import React, { useState, useEffect } from "react";
import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";
import ReadingComprehensionBot from "../../components/ReadingComprehensionBot/";
import ReactWhisper from "../../components/ReactWhisper/";
import Link from "next/link";
import AddComment from "../../components/AddComment/";
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
></link>;

const currentDate = new Date();
const yesterdayFormatted = new Date("2023-03-06").toISOString().substring(0, 10);
yesterdayFormatted.setDate(yesterdayFormatted.getDate() - 1);
const yesterday = yesterdayFormatted.toISOString().substring(0, 10);
const currentDate1 = new Date();
currentDate.setDate(currentDate1.getDate());
const today = currentDate.toISOString().substring(0, 10);
export default function MainPage() {
  const categories = [
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [showSummary, setShowSummary] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [sortBy, setSortBy] = useState("publishedAt");
  const [likedArticles, setLikedArticles] = useState({});
  const [transcribedText, setTranscribedText] = useState("");
  const [autoGetAnswer, setAutoGetAnswer] = useState(false);
  const [isSummaryShowing, setIsSummaryShowing] = useState({});
  const [seenArticles, setSeenArticles] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticles, setActiveArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  // Define state for showing comments
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [allComments, setAllComments] = useState({});

  // Simulating data fetching
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // For example, the data finishes loading after 3 seconds
  }, []);
  // Initialize comments from local storage when the component mounts
  useEffect(() => {
    const initialStoredComments = JSON.parse(
      localStorage.getItem("storedComments") || "{}"
    );
    setAllComments(initialStoredComments);
  }, []);

  // Save comments to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("storedComments", JSON.stringify(allComments));
  }, [allComments]);

  const updateComments = (articleId, newComments) => {
    setAllComments((prevComments) => {
      const updatedComments = { ...prevComments, [articleId]: newComments };
      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedComments;
    });
  };
  const toggleComments = (id) => {
    setShowComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Load comments from local storage when the component mounts

  useEffect(() => {
    const initialComments = JSON.parse(
      localStorage.getItem("comments") || "{}"
    );
    setAllComments(initialComments); // Assuming setAllComments is the state updater function for allComments in the parent component
  }, []);

  const handleReset = () => {
    setSearchQuery("");
  };
  const articlesPerPage = 10;
  useEffect(() => {
    document.title = "Aid Linua News";
  }, []);
  const toggleSummary = async (url, index, articleId) => {
    const wasSuccessful = await fetchSummary(url, index, articleId);

    if (!wasSuccessful) return;

    setShowSummary((prev) => {
      const updated = { ...prev };
      updated[url] = !updated[url];
      return updated;
    });
  };

  const fetchSummary = async (url, index, articleId) => {
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
      // Update searchResults
      setSearchResults((prevState) => {
        const updatedSearchResults = [...prevState];
        const searchIndex = updatedSearchResults.findIndex(
          (article) => article._id === articleId
        );
        if (searchIndex !== -1) {
          updatedSearchResults[searchIndex].summary = data.sm_api_content;
        }
        // console.log(
        //   "updatedSearchResultsSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
        //   updatedSearchResults
        // );
        return updatedSearchResults;
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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
          .map((article) => ({
            ...article,
            summary: null,
            likes: 0,
            comments,
          }));

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
        setIsLoading(true);

        const res = await fetch(
          `/api/fetchArticlesFromDb?category=${selectedCategory}&language=${selectedLanguage}&from=${fromDate}&to=${toDate}&sortBy=${sortBy}`
        );
        const data = await res.json();

        if (data.success) {
          const sortedArticles = data.data.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          );
          setArticles(sortedArticles);
        }
      } catch (error) {
        console.error("Failed to fetch articles from the database!", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromDb();
  }, [selectedCategory, selectedLanguage, fromDate, toDate, sortBy]);

  const fetchSearchResults = async () => {
    try {
      const res = await fetch(`/api/fetchArticlesFromDb?query=${searchQuery}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    } else {
      setSearchResults([]); // Clear search results when query is empty
    }
  }, [searchQuery]);

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
        setSearchResults((prevSearchResults) =>
          prevSearchResults.map((article) =>
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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // here we are saving the seen articles into a local storage so that when we refresh the page.

    const initialSeenArticles = JSON.parse(
      localStorage.getItem("seenArticles") || "{}"
    );

    setSeenArticles(initialSeenArticles);
  }, []);

  // Run whenever seenArticles changes to update localStorage
  useEffect(() => {
    if (seenArticles && Object.keys(seenArticles).length > 0) {
      localStorage.setItem("seenArticles", JSON.stringify(seenArticles));
    }
  }, [seenArticles]);

  const handleSeen = async (articleId) => {
    try {
      const res = await fetch(`/api/updateSeenArticle?articleId=${articleId}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update local state to reflect 'seen' status
        setSeenArticles((prev) => {
          const updatedSeen = { ...prev, [articleId]: true };
          return updatedSeen;
        });

        // Optionally, update any other local state
      } else {
        const text = await res.text();
        console.error(`Server responded with an error: ${text}`);
        throw new Error(`Server responded with status ${res.status}`);
      }
    } catch (error) {
      console.error(
        "An error occurred while marking the article as seen:",
        error
      );
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const toggleAndTriggerAudio = (articleUrl, index, articleId) => {
    setIsSummaryShowing((prevState) => ({
      ...prevState,
      [articleUrl]: !prevState[articleUrl],
    }));
    toggleSummary(articleUrl, index, articleId);
    if (!showSummary[articleUrl]) {
      setAutoGetAnswer(true);
    }
  };

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      // Assuming searchResults holds the filtered articles
      setActiveArticles(searchResults);
    } else {
      setActiveArticles(articles);
      setCurrentPage(1);
    }
  }, [searchQuery, searchResults, articles]);
  // console.log("final dsearch results are: ", searchResults);

  //  View 10 articles maximum in page
  const searchResultss = searchResults.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const articlesToRender = searchQuery ? searchResultss : currentArticles;
  useEffect(() => {
    let newTotalPages;

    if (searchQuery) {
      // console.log("Filtered articles length: ", articlesToRender.length);
      newTotalPages = Math.ceil(searchResults.length / articlesPerPage);
    } else {
      // console.log("Total articles length: ", articles.length);
      newTotalPages = Math.ceil(articles.length / articlesPerPage);
    }

    setTotalPages(newTotalPages);
  }, [articles, articlesToRender, articlesPerPage, searchQuery, searchResults]);

  return (
    <div className="App">
      {/* if no data keep loading */}
      {isLoading ? (
        <div className="loading-container" aria-live="polite">
          <div className="glowing-text">Loading...</div>
        </div>
      ) : (
        <>
          {/* <header role="banner">
            <h1 id="appTitle">AID LINGUA NEWS APP</h1>
            <img src="d6.png" alt="Website logo" id="header-logo"></img>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
            />
          </header> */}
          <header role="banner">
            <div id="logo-and-title">
              <div id="logo-and-text">
                <a aria-label="Home page">
                  <img src="d6.png" alt="Website logo" />
                </a>
                <h2 id="logo-name">AID LINGUA</h2>
              </div>
              <div id="search-container">
                <label htmlFor="search-input" className="visually-hidden">
                  Search Articles
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  aria-label="Search articles"
                />
                <button
                  id="reset-button"
                  onClick={handleReset}
                  disabled={!searchQuery}
                  aria-label="Reset search query"
                >
                  Reset
                </button>
              </div>
            </div>
          </header>

          {/* this div is for the project logo */}
          {/* <div className="container">
            <AidLinguaLogo text="here iam testing" />
          </div> */}
          <main role="main">
            <h1 id="appTitle">Empowering News Accessibility with AID LINGUA</h1>
            <h2 id="app_subtitle">
              your gateway to easily accessible news, designed to empower
              everyone, no writing required
            </h2>

            <section className="filter-container" aria-labelledby="appTitle">
              {/* here is where i get the value if the user select the sports category 
            , then the value will be sport*/}
              <h2 className="visually-hidden">Filter Options</h2>
              <form className="filter-form" aria-labelledby="appTitle">
                <div className="input-wrapper width-50">
                  <label htmlFor="categorySelect">Category:</label>
                  <select
                    id="categorySelect"
                    value={selectedCategory}
                    className="Category-select"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Choose Category"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-wrapper width-50">
                  <label htmlFor="languageLabel" aria-label="Choose Language">
                    Language:
                    {/* here is where the Language text is replaced with an emoji */}
                    {/* here is where i get the values either en or de for the language*/}
                  </label>
                  <select
                    id="languageLabel"
                    value={selectedLanguage}
                    // aria-labelledby="languageLabel"
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    aria-label="Choose Language"
                  >
                    {languages.map((lang, index) => (
                      <option key={index} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-wrapper width-50">
                  <label htmlFor="fromDate">From:</label>
                  <input
                    value={fromDate}
                    id="fromDate"
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
                    aria-label="YYYY-MM-DD"
                  />
                </div>
                <div className="input-wrapper width-50">
                  <label htmlFor="toDate">To: </label>

                  <input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    aria-label="YYYY-MM-DD"
                  />
                </div>
                <div className="input-wrapper width-50">
                  <label htmlFor="sortBySelect">Sort By: </label>

                  <select
                    id="sortBySelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </section>

            <section
              className="articles"
              aria-labelledby="articles-section-heading"
            >
              {/* viiiiiii: here where i render the list of articles into the app homepage*/}
              <h2 id="articles-section-heading" className="visually-hidden">
                List of Articles
              </h2>

              {articlesToRender.map((article, index) => {
                // Skip rendering the article if it has the default image

                if (
                  article.urlToImage ===
                  "https://www.discovergreece.com/sites/default/files/dg-fallback-20.jpg"
                ) {
                  return null;
                }

                return (
                  <div className="article" key={index} role="article">
                    <button
                      id="summaryToggle_Btn"
                      className={`summaryLabel${
                        showSummary[article.url] ? "summaryLabelActive" : ""
                      }`}
                      // role="button"
                      tabIndex="0"
                      aria-expanded={
                        showSummary[article.url] ? "true" : "false"
                      }
                      onClick={() =>
                        toggleAndTriggerAudio(
                          article.url,
                          indexOfFirstArticle + index,
                          article._id
                        )
                      }
                    >
                      {showSummary[article.url]
                        ? "Hide Summary"
                        : "Show Summary"}
                    </button>

                    <h2 className="article-title">{article.title}</h2>

                    <img
                      loading="lazy"
                      className="articleImage"
                      src={article.urlToImage}
                      alt={`Image for the article id ${index}`}
                      width={400}
                      height={300}
                    />

                    <div className="action-container">
                      <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                      ></link>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${article.url}`}
                        className="fa fa-twitter"
                        target="_blank"
                        rel="noopener noreferrer"
                        alt="Share on Twitter"
                      >
                        {" "}
                        <span className="visually-hidden">
                          Share on Twitter
                        </span>
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${article.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fa fa-facebook"
                        alt="Share on Facebook"
                      >
                        {" "}
                        <span className="visually-hidden">
                          Share on Facebook
                        </span>
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${article.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fa fa-whatsapp"
                      >
                        <span className="visually-hidden">
                          Share on Whatsapp
                        </span>
                      </a>

                      <a
                        href={`mailto:?subject=Check out this article!&body=${article.url}`}
                        className="fa fa-email"
                        alt="Share on Email"
                      >
                        {" "}
                        <span className="visually-hidden">Share on Email</span>
                        📧
                      </a>
                    </div>

                    {/* here is where i show or render the summary for a given url below the image of the url. Not only this but also 
                  the user can ask a question based on a reding comprehension text and get answer from 
                  another server implemented in python and listens
                  on another port 5000. The server job is to take the question + summary text
                  then pass it into the deep learning model for Question answering
                  send the results back into the client side and show it below the summaty text.  */}

                    {showSummary[article.url] && (
                      <>
                        <div className="summary-overlay"></div>
                        <div
                          className="reading-comprehension-bot"
                          aria-live="polite"
                          style={{ height: "auto" }}
                        >
                          <button
                            onClick={() =>
                              toggleAndTriggerAudio(
                                article.url,
                                indexOfFirstArticle + index,
                                article._id
                              )
                            }
                          >
                            Hide Summary
                          </button>
                          <ReactWhisper
                            setTranscribedText={setTranscribedText}
                            setAutoGetAnswer={setAutoGetAnswer}
                            shouldListen={isSummaryShowing[article.url]}
                          />
                          <ReadingComprehensionBot
                            transcribedText={transcribedText}
                            SummaryText={article.summary}
                            autoGetAnswer={autoGetAnswer}
                          />
                        </div>
                      </>
                    )}
                    <div className="write-comment-footer">
                      <a
                        id="read-original_article"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Read more about ${article.title}`}
                        className="read-more-link"
                        onClick={(e) => {
                          handleSeen(article._id); // Mark as seen when link is clicked
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSeen(article._id);
                        }}
                      >
                        Read Original Article <br />
                        {seenArticles[article._id] ? "👁️ ☑️" : ""}
                      </a>

                      <span className="like-container">
                        <div className="likess">
                          <span
                            className={`like-button ${
                              likedArticles[article._id]
                                ? "like-button--liked"
                                : "like-button--unliked"
                            }`}
                            role="button"
                            tabIndex="0"
                            aria-pressed={
                              likedArticles[article._id] ? "true" : "false"
                            }
                            onClick={() => handleLike(article._id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleLike(article._id);
                            }}
                          >
                            {likedArticles[article._id] ? (
                              "💙"
                            ) : (
                              <span style={{ color: "black" }}>like me 🤍</span>
                            )}
                          </span>

                          <span className="like-count" aria-label="likes count">
                            {/* <div>
                            {(() => {
                              console.log(
                                "showwwwwwSummary",
                                article._id,
                                article.likes
                              );
                            })()}
                          </div>{" "} */}
                            {article.likes}
                          </span>
                        </div>
                      </span>
                      <button
                        className="write-commentBtn"
                        tabIndex="0"
                        aria-expanded={
                          showComments[article._id] ? "true" : "false"
                        }
                        onClick={() => toggleComments(article._id)}
                      >
                        Write comment
                      </button>
                    </div>
                    {showComments[article._id] && (
                      <div className="comment-overlay">
                        <AddComment
                          articleId={article._id}
                          isVisible={showComments[article._id]}
                          toggleComments={() => toggleComments(article._id)}
                          comments={allComments[article._id] || []}
                          updateComments={updateComments}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </main>
          {isVisible && (
            <button
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top of the page" /* Accessibility */
            >
              ⬆️
            </button>
          )}
          <nav
            aria-label="Pagination"
            role="navigation"
            className="pagination-container"
          >
            <button
              className="pagination-button"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span
              aria-label={`Current page, ${currentPage}`}
              className="pagination-text"
            >
              {`${currentPage} / ${totalPages}`}
            </span>

            <button
              className="pagination-button"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
