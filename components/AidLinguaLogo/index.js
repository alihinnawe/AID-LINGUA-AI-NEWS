// Globe.js
import React, { useEffect, useRef } from "react";

const Globe = ({ text }) => {
  const textContainer = useRef(null);

  useEffect(() => {
    const letters = text.split("");
    const radius = 100;
    const step = (2 * Math.PI) / letters.length;

    letters.forEach((letter, i) => {
      const theta = i * step;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const span = document.createElement("span");
      span.className = "text";
      span.innerText = letter;
      span.style.transform = `translate(-50%, -50%) rotate(${
        theta + Math.PI / 2
      }rad)`;
      textContainer.current.appendChild(span);
    });
  }, [text]);

  return (
    <div className="circle">
      <div className="logo"></div>
      <div className="text-container" ref={textContainer}></div>
    </div>
  );
};

export default Globe;
