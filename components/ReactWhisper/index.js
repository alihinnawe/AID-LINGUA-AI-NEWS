import React, { useEffect } from "react"; // Make sure to import useEffect
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ReactWhisper = ({ setTranscribedText }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Add this useEffect hook
  useEffect(() => {
    setTranscribedText(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support Speech Recognition</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
      >
        Start
      </button>
      <button onClick={() => SpeechRecognition.stopListening()}>Stop</button>
      <button onClick={() => resetTranscript()}>Reset</button>
      <p>Transcribed Text: {transcript}</p>
    </div>
  );
};

export default ReactWhisper;
