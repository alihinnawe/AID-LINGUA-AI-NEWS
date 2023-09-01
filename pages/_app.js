import "@/styles/globals.css";
import React, { useState } from "react";

export default function App({ Component, pageProps }) {
  const [bookmarks, setBookmarks] = useState([]);

  const handleBookmarkToggle = (article) => {
    const isBookmarked = bookmarks.some((bm) => bm.id === article.id);
    if (isBookmarked) {
      setBookmarks(bookmarks.filter((bm) => bm.id !== article.id));
    } else {
      setBookmarks([...bookmarks, article]);
    }
  };
  return (
    <Component
      {...pageProps}
      bookmarks={bookmarks}
      handleBookmarkToggle={handleBookmarkToggle}
    />
  );
}
