from flask import Flask, render_template, request
import os
import http.client
import json

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/dataTransfer', methods=['POST'])
def upload():
    
    connection = http.client.HTTPConnection('localhost', 3000, timeout=10)
    headers = {'Content-type': 'application/json'}
    print(request.json)
    connection.request("POST", "/dataTransfer",json.dumps(request.json) ,headers)
    response = connection.getresponse()
    return response.read().decode()

if __name__ == '__main__':
    app.run(debug=True)
