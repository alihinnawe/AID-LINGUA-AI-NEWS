import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ArticleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log("id issss", id);
      // Fetch the article details using `id` from your database or API
      fetch(`/api/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setArticle(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the article", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.url}</p>
      {/* You can add a comment section here */}
      {/* You can add a feedback form here */}
    </div>
  );
};

export default ArticleDetail;
