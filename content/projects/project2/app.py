from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

ALLOWED_BOOKS = {
    'crime.txt',
    'edgar.txt',
    'pride.txt',
    'dracula.txt',
    'locke.txt',
    'nietszche.txt',
    'quixote.txt',
    'republic.txt',
    'romeo.txt',
    'war.txt',
    'women.txt'
}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    
    # Validate input
    if not data or 'books' not in data or 'n' not in data or 'sentences' not in data:
        return jsonify({'error': 'Missing required parameters'}), 400
    
    books = data['books']
    n = int(data['n'])
    sentences = int(data['sentences'])
    
    # Validate parameters
    if not (1 <= len(books) <= 3):
        return jsonify({'error': 'Select 1-3 books'}), 400
    if not (1 <= n <= 5):
        return jsonify({'error': 'N must be between 1 and 5'}), 400
    if not (1 <= sentences <= 10):
        return jsonify({'error': 'Number of sentences must be between 1 and 10'}), 400
    
    # Validate book names for security
    if not all(book in ALLOWED_BOOKS for book in books):
        return jsonify({'error': 'Invalid book selection'}), 400
    
    # Construct command
    book_paths = [os.path.join('data', book) for book in books]
    cmd = ['python3', 'ngram.py', str(n), str(sentences)] + book_paths
    
    try:
        # Run ngram.py and capture output
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            return jsonify({'error': 'Error generating text', 'details': result.stderr}), 500
        
        return jsonify({'text': result.stdout})
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Generation timed out'}), 500
    except Exception as e:
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)