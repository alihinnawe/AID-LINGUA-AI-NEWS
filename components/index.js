export default function MyFavorite({ bookmarks }) {
  return (
    <div>
      <h1>My Favorite Articles</h1>
      {/* Display bookmarked articles */}
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id}>{bookmark.title}</div>
      ))}
    </div>
  );
}
