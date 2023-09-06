import { useWhisper } from "@chengsokdara/use-whisper";

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
    apiKey: "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", // YOUR_OPEN_AI_TOKEN

    streaming: true,
    timeSlice: 1_000, // 1 second
    whisperConfig: {
      language: "en",
    },
    onTranscribe,
  });

  const onTranscribe = async (blob) => {
    const base64 =
      (await new Promise()) <
      string >
      ((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    // console.log(
    //   "LiveWhisperLiveWhisperLiveWhisper",
    //   recording,
    //   speaking,
    //   transcribing,
    //   transcript
    // );

    console.log("base64base64base64base64base64", base64);
    const body = JSON.stringify({ file: base64, model: "whisper-1" });
    console.log("bodyyyyyyyyyy", body);
    const headers = { "Content-Type": "application/json" };

    const response = await fetch("/api/whisper", {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json();
    const { text } = data;
    console.log("texttttttttttttt", text);
  };
  // const { transcript } = LiveWhisper({
  //   // callback to handle transcription with custom server

  //   onTranscribe,
  // });

  // console.log("transcripttranscripttranscripttranscript", transcript);
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
