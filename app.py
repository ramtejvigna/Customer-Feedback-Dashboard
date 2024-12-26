from flask import Flask, request, jsonify
import pickle
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re

app = Flask(__name__)

# Load the model and vectorizer
with open('feedback_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Tokenization
    tokens = word_tokenize(text)
    # Remove stopwords
    tokens = [token for token in tokens if token not in stop_words]
    # Join tokens back into text
    return ' '.join(tokens)

@app.route('/analyze_feedback', methods=['POST'])
def analyze_feedback():
    try:
        data = request.get_json()
        
        if not data or 'feedback' not in data:
            return jsonify({'error': 'No feedback provided'}), 400
        
        # Preprocess the feedback
        processed_feedback = preprocess_text(data['feedback'])
        
        # Transform the text using the vectorizer
        feedback_vector = vectorizer.transform([processed_feedback])
        
        # Make prediction
        prediction = model.predict(feedback_vector)[0]
        
        # Map prediction to sentiment
        sentiment_map = {0: 'unhappy', 1: 'neutral', 2: 'happy'}
        sentiment = sentiment_map[prediction]
        
        return jsonify({
            'feedback': data['feedback'],
            'sentiment': sentiment
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/')
def home():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)