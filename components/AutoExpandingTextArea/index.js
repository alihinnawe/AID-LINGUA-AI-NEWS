import React, { useEffect, useRef } from "react";

const AutoExpandingTextarea = ({ TranscribedText }) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [TranscribedText]); // Adjust height whenever TranscribedText changes

  return (
    <div className="user-input_div">
      <label id="user-input-label" className="visually-hidden">
        Ask a question
      </label>
      <textarea
        className="reading-comprehension-bot_textarea"
        type="text"
        readOnly
        placeholder="Ask me a question"
        aria-labelledby="user-input-label"
        aria-readonly="true"
        value={TranscribedText}
        ref={textareaRef}
        // rows="1"
        // style={{ resize: "none", overflow: "hidden" }}
      ></textarea>
    </div>
  );
};

export default AutoExpandingTextarea;
