from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import RobertaTokenizer, RobertaForQuestionAnswering
import torch

app = Flask(__name__)
CORS(app)

tokenizer = RobertaTokenizer.from_pretrained("deepset/roberta-base-squad2")
model = RobertaForQuestionAnswering.from_pretrained(
    "deepset/roberta-base-squad2")


@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    print("dataaaaa is", data)
    question = data['question']
    context = data['SummaryText']
    print("passs1111111111111111")
    inputs = tokenizer(question, context, return_tensors='pt')
    outputs = model(**inputs)
    print("passs11111111111111112222222222222222")

    answer_start = torch.argmax(outputs.start_logits)
    answer_end = torch.argmax(outputs.end_logits)
    print("passs1111111111111111222222222222222233333333333333")

    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(
        inputs['input_ids'][0][answer_start:answer_end+1]))
    print("answerrrrrrrrrrrrr issssss", answer)

    return jsonify({'answer': answer})


if __name__ == '__main__':
    app.run(port=5000)
