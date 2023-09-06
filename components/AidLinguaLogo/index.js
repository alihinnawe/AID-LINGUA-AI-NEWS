import React, { useEffect } from "react";

export default function AidLinguaLogo() {
  const text = "";
  const words = text.split("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const container = document.getElementById("text-container");
      if (container) {
        const current = parseFloat(
          container.style.transform.replace(/rotate\((.*)deg\)/, "$1")
        );
        const newVal = isNaN(current) ? 0 : current;
        container.style.transform = `rotate(${newVal + 1}deg)`;
        console.log("Container rotated"); // Debugging line
      }
    }, 50); // Adjust speed as necessary

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="circle">
      <div className="logo"></div>
      <div id="text-container" className="text-container">
        {words.map((word, index) => {
          const scalingFactor = 0.9; // Adjust this as needed
          const angle = (360 / words.length) * index * scalingFactor;
          return (
            <span
              key={index}
              className="text"
              style={{
                transform: `rotate(${angle}deg) translate(130px) rotate(-${angle}deg)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
