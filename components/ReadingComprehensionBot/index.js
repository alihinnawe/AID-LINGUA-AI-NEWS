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
    <div>
      <h2>Reading Comprehension Bot</h2>
      <div id="content">
        <p>{SummaryText}</p>
      </div>
      <input
        type="text"
        value={transcribedText} // Use transcribedText as the value of the input field
        readOnly
        placeholder="Ask me a question"
      />
      <button disabled={!transcribedText}>Get Answer</button>
      {answer && <div>Answer: {answer}</div>}
    </div>
  );
};
export default ReadingComprehensionBot;
