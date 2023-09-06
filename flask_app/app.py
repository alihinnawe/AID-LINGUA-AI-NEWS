from flask import Flask, request, jsonify
import openai
import torch
# ...other imports and setup...

app = Flask(__name__)


@app.route('/ask', methods=['POST'])
def ask():
    content = request.json
    question = content['question']
    text = content['SummaryText']
    inputs = tokenizer(question, text, return_tensors='pt')
    outputs = model(**inputs)
    answer_start = torch.argmax(outputs.start_logits)
    answer_end = torch.argmax(outputs.end_logits) + 1
    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(
        inputs['input_ids'][0][answer_start:answer_end]))

    return jsonify({'answer': answer})


@app.route('/api/whisper', methods=['POST'])
def whisper():
    print("requestttttttt issssssssssssssssssss:", request)
    audio_data = request.json['file']  # Assuming you send base64 encoded audio
    model_name = request.json['model']

    audio_file = open(audio_data, model_name)
    transcript = openai.Audio.translate(model_name, audio_file)

    return jsonify({
        'text': transcript  # Replace with the actual text from the response if it's nested
    })

# ...other routes and application logic...
