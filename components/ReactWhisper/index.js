import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ReactWhisper = ({
  setTranscribedText,
  shouldListen,
  setAutoGetAnswer,
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [activeRecording, setActiveRecording] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  useEffect(() => {
    if (shouldListen) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [shouldListen]);
  useEffect(() => {
    let silenceTimer;

    if (transcript.toLowerCase().includes("whisper") && !activeRecording) {
      setActiveRecording(true);
      resetTranscript();
      setTranscribedText(""); // Reset the input text
    }

    if (activeRecording) {
      if (transcript !== lastTranscript) {
        setLastTranscript(transcript);
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          const cleanedTranscript = transcript.replace(/whisper/gi, "").trim();
          setTranscribedText(cleanedTranscript);
          resetTranscript();
          setActiveRecording(false);
        }, 7000); // Stops after 2 seconds of silence
      }
    }
  }, [transcript, lastTranscript, activeRecording]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support Speech Recognition</span>;
  }

  return (
    <div role="main" aria-labelledby="react-whisper-heading">
      <h2 id="react-whisper-heading"> Whisper is Ready for Questions!</h2>

      <p id="microphone-status">Microphone: {listening ? "on" : "off"}</p>
      <button
        tabIndex="0"
        aria-label="Reset Transcript"
        onClick={resetTranscript}
      >
        Reset
      </button>
      <br />
      <div id="transcribed-text" aria-live="polite">
        <p id="Trnscribe-Text">Transcribed Text: {transcript}</p>
      </div>
    </div>
  );
};

export default ReactWhisper;
