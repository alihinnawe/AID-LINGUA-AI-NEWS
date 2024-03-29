import React, { useState, useEffect } from "react";

function AddComment({
  articleId,
  isVisible,
  toggleComments,
  comments,
  updateComments,
}) {
  const [commentText, setCommentText] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showInputs, setShowInputs] = useState(false);

  const handleAddComment = async () => {
    const timestamp = new Date().toISOString(); // Generate the timestamp here

    try {
      const response = await fetch("/api/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          comment: commentText,
          username: username || "Anonymous",
          email: email || "example@email.com",
          timestamp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newComments = [data, ...comments];
        updateComments(articleId, newComments);
        setCommentText("");
        // ... rest of the code
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("There was an error adding the comment:", error);
    }
    // Hide the inputs after comment is added
    setShowInputs(false);
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
    <div
      className="comments-container"
      role="region"
      aria-label="Comments section"
    >
      <div className="comment-top">
        <button
          className="Hide_commentsBtn"
          onClick={toggleComments}
          aria-label={isVisible ? "Hide Comments" : "Show Comments"}
        >
          {isVisible ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      <div className="comment-items-container">
        {comments.map((comment) => (
          <div className="comment-item" key={comment._id}>
            <span className="comment-content">
              {comment.username}: {comment.content}
            </span>
            <span className="comment-timestamp">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="comment-bottom">
        <fieldset className={`comment-inputs ${showInputs ? "show" : ""}`}>
          <label>
            Username:
            <input
              type="text"
              aria-label="Username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              aria-label="Email"
              placeholder="Email (will not be shown)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Comment:
            <textarea
              type="text"
              aria-label="Add comment"
              placeholder="add comment here"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </label>
        </fieldset>

        <button
          className="add-comment-button"
          onClick={() => {
            handleAddComment();
            setShowInputs(false); // hide the inputs when a comment is added
          }}
          aria-label="Add comment"
          onMouseEnter={() => setShowInputs(true)}
        >
          Add comment
        </button>
      </div>
    </div>
  );
}

export default AddComment;
