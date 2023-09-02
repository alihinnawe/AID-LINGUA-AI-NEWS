from flask import Flask, request, jsonify
from transformers import RobertaForQuestionAnswering, RobertaTokenizer
import torch  # <- Add this line
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <- CORS support

model_name = "deepset/roberta-base-squad2"
model = RobertaForQuestionAnswering.from_pretrained(model_name)
tokenizer = RobertaTokenizer.from_pretrained(model_name)


@app.route('/ask', methods=['POST'])
def ask():
    content = request.json
    question = content['question']
    text = content['text']

    inputs = tokenizer(question, text, return_tensors='pt')
    outputs = model(**inputs)
    answer_start = torch.argmax(outputs.start_logits)
    answer_end = torch.argmax(outputs.end_logits) + 1
    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(
        inputs['input_ids'][0][answer_start:answer_end]))

    return jsonify({'answer': answer})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)
