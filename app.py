from flask import Flask, make_response, request, jsonify
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import logging


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

from models import Score

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/submit_score', methods=['OPTIONS'])
def submit_score_options():
    response = make_response('', 204)
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

@app.route('/submit_score', methods=['POST', 'OPTIONS'])
def submit_score():
    try:
        data = request.get_json()
        user_id = data['user_id']
        score = data['score']

        # スコアをデータベースに追加
        new_score = Score(user_id=user_id, score=score, timestamp=datetime.now())
        db.session.add(new_score)
        db.session.commit()

        return jsonify({"message": "Score submitted successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/weekly_ranking', methods=['GET'])
def weekly_ranking():
    one_week_ago = datetime.now() - timedelta(weeks=1)
    scores = Score.query.filter(Score.timestamp > one_week_ago).order_by(Score.score.desc()).all()
    ranking = [{"user_id": score.user_id, "score": score.score} for score in scores]
    return jsonify(ranking), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

logging.basicConfig(level=logging.DEBUG)
