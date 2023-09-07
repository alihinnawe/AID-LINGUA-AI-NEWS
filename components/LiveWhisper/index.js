import { useWhisper } from "@chengsokdara/use-whisper";
import OnTranscribe from "../Transcript";
console.log(
  "ddddddddddddddddddddddddsuuuuu",
  process.env.NEXT_PUBLIC_OPENAI_API_TOKEN
);
const LiveWhisper = () => {
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_TOKEN, // YOUR_OPEN_AI_TOKEN
  });
  console.log(
    // "recording",
    // recording,
    // "speaking",
    // speaking,
    // "transcribing",
    // transcribing.blob,
    // "transcript",
    // transcript.text,
    transcript.blob
    // "pauseRecording",
    // pauseRecording,
    // "startRecording",
    // startRecording,
    // "stopRecording",
    // stopRecording
  );
  console.log("onTranscribbbbbbbbbbbbbbbbbbbbbbbbb", transcript.blob);
  OnTranscribe(transcript.blob);
  // console.log(
  //   "onTranscribbbbbbbbbbbbbbbbbbbbbbbbb",
  //   OnTranscribe(transcript.blob)
  // );
  return (
    <div>
      <p>Recording: {recording}</p>
      <p>Speaking: {speaking}</p>
      <p>Transcribing: {transcribing}</p>
      <p>Transcribed Text: {transcript.text}</p>
      <button onClick={() => startRecording()}>Start</button>
      <button onClick={() => pauseRecording()}>Pause</button>
      <button onClick={() => stopRecording()}>Stop</button>
    </div>
  );
};

export default LiveWhisper;
