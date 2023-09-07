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


# @app.route('/whisper', methods=['POST'])
# def whisper():
#     content = request.json


#     return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
