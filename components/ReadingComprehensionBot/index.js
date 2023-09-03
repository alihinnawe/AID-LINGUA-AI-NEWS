import React, { useState } from "react";

const ReadingComprehensionBot = ({ SummaryText }) => {
  console.log("Reading Comprehension bot is triggrered");
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const getAnswer = async () => {
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          SummaryText: SummaryText,
        }),
      });
      const data = await response.json();
      if (data && data.answer) {
        setAnswer(data.answer);
      }
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  return (
    <div>
      <h2>Reading Comprehension Bot</h2>
      <div id="content">
        <p>{SummaryText}</p>
      </div>
      <input
        type="text"
        value={userQuestion}
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="Ask me a question"
      />
      <button onClick={getAnswer}>Get Answer</button>
      <div>{answer && <p>Answer: {answer}</p>}</div>
    </div>
  );
};

export default ReadingComprehensionBot;
