import React, { useState, useEffect } from "react";

const ReadingComprehensionBot = ({ transcribedText, SummaryText }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    // Use transcribedText as userQuestion
    setUserQuestion(transcribedText);
  }, [transcribedText]);

  const getAnswer = async () => {
    try {
      console.log("user question is", userQuestion);
      console.log("bodyyyyyyryyyyyyyyyyyyyyyyyyyy", SummaryText);

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

      console.log("bodyyyyyyryyyyyyyyyyyyyyyyyyyy", response);
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
        value={userQuestion} // Changed to userQuestion
        onChange={(e) => setUserQuestion(e.target.value)}
        placeholder="Ask me a question"
      />
      <button onClick={getAnswer}>Get Answer</button>
      <div className="answer">{answer && <p>Answer: {answer}</p>}</div>
    </div>
  );
};

export default ReadingComprehensionBot;
