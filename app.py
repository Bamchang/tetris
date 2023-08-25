from flask import Flask, make_response, render_template, request, redirect, url_for, flash, Blueprint,jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from markupsafe  import escape
from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import logging


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.config['SECRET_KEY'] = 'aaaa'


from .models import User,Score

@app.route('/')
def home():
    return "Welcome to the Home Page <a href='./login'> Go to login</a>"


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


#認証関係
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(username):
    return User.query.get(username)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first() # if this returns a user, then the email already exists in database

        if user: # if a user is found, we want to redirect back to signup page so user can try again
            flash('your username already used', 'error')
            return redirect(url_for('signup'))

        # create a new user with the form data. Hash the password so the plaintext version isn't saved.
        new_user = User(username=username, password=generate_password_hash(password, method='sha256'))

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(url_for('dashboard', user_id=escape(new_user.username)))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        #formから各情報を取得
        username = request.form.get('username')
        password = request.form.get('password')

        #dbからゲット
        user = User.query.filter_by(username=username).first() 
        
        #user_idが見つからない
        if user is None:
            flash('No username', 'error')
            return render_template('login.html')
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for(f'dashboard', user_id=escape(user.username)))
        else:
            flash('Invalid username or password', 'error')
    return render_template('login.html')

@app.route('/dashboard/<user_id>')
@login_required
def dashboard(user_id):
    return f"Welcome to the Dashboard, {user_id}!"

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

logging.basicConfig(level=logging.DEBUG)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)


