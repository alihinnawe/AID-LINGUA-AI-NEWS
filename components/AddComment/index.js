import React, { useState, useEffect } from "react";

function AddComment({
  articleId,
  isVisible,
  toggleComments,
  comments,
  updateComments,
}) {
  const [commentText, setCommentText] = useState("");
  const [toggleFetch, setToggleFetch] = useState(false);
  const handleAddComment = async () => {
    try {
      const response = await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          comment: commentText,
          username: "JohnDoe",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newComments = [data, ...comments];
        updateComments(articleId, newComments); // This should update your state and re-render
        setCommentText("");

        // Update local storage
        const existingComments = JSON.parse(
          localStorage.getItem("comments") || "{}"
        );
        existingComments[articleId] = newComments;
        localStorage.setItem("comments", JSON.stringify(existingComments));
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("There was an error adding the comment:", error);
    }
  };

  useEffect(() => {
    const storedComments = JSON.parse(
      localStorage.getItem(`comments-${articleId}`) || "[]"
    );
    updateComments(articleId, storedComments);
  }, [articleId]);

  useEffect(() => {
    localStorage.setItem(`comments-${articleId}`, JSON.stringify(comments));
  }, [comments]);

  // Inside your AddComment component
  return (
    <div className="comments-container">
      <div className="comment-top">
        <button onClick={toggleComments}>
          {isVisible ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      <div className="comment-items-container">
        {comments.map((comment) => (
          <div className="comment-item" key={comment._id}>
            <span className="comment-content">
              {comment.username}: {comment.content}
            </span>
          </div>
        ))}
      </div>

      <div className="comment-bottom">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="add-comment-button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default AddComment;
