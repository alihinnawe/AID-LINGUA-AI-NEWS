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
    <div id="user-input_div">
      <textarea
        type="text"
        readOnly
        placeholder="Ask me a question"
        aria-labelledby="user-input-label"
        value={TranscribedText}
        ref={textareaRef}
        rows="1"
        style={{ resize: "none", overflow: "hidden" }}
      ></textarea>
    </div>
  );
};

export default AutoExpandingTextarea;
