from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from markupsafe  import escape
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = "your_secret_key_here"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
db = SQLAlchemy(app)

app = Blueprint('login', __name__)

login_manager = LoginManager()
login_manager.init_app(app)

# ダミーのユーザーデータを作成
class User(UserMixin):
    def __init__(self, username, password):
        self.id = username
        self.password = password

# ユーザーデータベースの代わりに辞書を使用
users = {
    "user1": User("user1", "password1"),
    "user2": User("user2", "password2")
}

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

@app.route('/')
def home():
    print()
    return "Welcome to the Home Page <a href='./login'> Go to login</a>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users.get(username)
        if user and user.password == password:
            login_user(user)
            return redirect(url_for(f'dashboard', user_id=escape(user.id)))
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

if __name__ == '__main__':
    app.run(debug=True)
