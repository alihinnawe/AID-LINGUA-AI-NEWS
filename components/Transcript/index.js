import { useWhisper } from "@chengsokdara/use-whisper";
import axios from "axios";

const OnTranscribe = async (blob) => {
  console.log(" blooooooooob is Transcript page", blob);
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  const body = JSON.stringify({ file: base64, model: "whisper-1" });
  const headers = { "Content-Type": "application/json" };

  const response = await axios.post("/api/whisper", body, {
    headers,
  });
  const { text } = response.data;
  console.log("textttttttt", text);

  const onTranscribe = OnTranscribe;

  const { transcript } = useWhisper({
    onTranscribe,
  });

  return (
    <div>
      <p>
        Transcribed Text: {transcript?.text || "No transcription available"}
      </p>
    </div>
  );
};

export default OnTranscribe;
