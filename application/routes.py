from flask import render_template

def create_routes(app):

    @app.route('/')
    def home():
        return render_template('index.html')