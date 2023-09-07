// transcript = openai.Audio.transcribe("whisper-1", audio_file)

const apiKey = process.env.OPENAI_API_TOKEN;

export default async function handler(req, res) {
  try {
    const { file, model } = req.body;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        file,
        model,
      },
      { headers }
    );

    const transcript = response.data.text;

    res.json({ text: transcript });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
