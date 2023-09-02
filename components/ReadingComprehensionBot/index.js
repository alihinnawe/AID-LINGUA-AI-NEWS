import React, { useState } from "react";

const ReadingComprehensionBot = ({ SummaryText }) => {
  const [userQuestion, setUserQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sourceText, setSourceText] = useState(
    "FC Barcelona president Joan Laporta also commented on the arrival of João Félix to the Club. We are signing a great talent who will be able to express himself in a system which is perfect for him. He is one of the players who has shown most commitment and desire to make the move to Barça. He is really motivated and this signing would not have been possible without all the hard work."
  );

  const getAnswer = async () => {
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userQuestion, SummaryText }),
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
