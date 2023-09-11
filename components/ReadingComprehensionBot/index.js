import React, { useState, useEffect } from "react";

const ReadingComprehensionBot = ({
  transcribedText,
  SummaryText,
  autoGetAnswer,
}) => {
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (autoGetAnswer && transcribedText) {
      const getAnswer = async () => {
        try {
          const response = await fetch("http://localhost:5000/ask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: transcribedText,
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
        console.log("answer is: ", answer);
      };

      getAnswer();
    }
  }, [autoGetAnswer, transcribedText, SummaryText]);

  return (
    <div role="main">
      <h2 id="reading-comprehension-bot-heading">Reading Comprehension Bot</h2>
      <div id="content" aria-labelledby="reading-comprehension-bot-heading">
        <p>{SummaryText}</p>
      </div>
      {/* <label htmlFor="user-input" id="user-input-label">
        Ask me a question
      </label> */}

      <input
        id="user-input"
        type="text"
        value={transcribedText} // Use transcribedText as the value of the input field
        readOnly
        placeholder="Ask me a question"
        aria-labelledby="user-input-label"
      />
      <button
        tabIndex="0"
        aria-label="Get Answer"
        disabled={!transcribedText}
        aria-disabled={!transcribedText ? "true" : "false"}
      >
        Get Answer
      </button>
      {/* <button
        tabIndex="0"
        aria-label={answer ? "Answered" : "Get Answer"}
        disabled={!transcribedText}
        aria-disabled={!transcribedText ? "true" : "false"}
      >
        {answer ? "Answered" : "Get Answer"}
      </button> */}
      {answer && (
        <div id="answer" aria-live="polite">
          Answer: {answer}
        </div>
      )}
    </div>
  );
};
export default ReadingComprehensionBot;
