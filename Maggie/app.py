from flask import (
    Flask,
    render_template,
)
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index2.html")

@app.route("/index.html")
def inex():
    return render_template("index.html")

@app.route("/Refugee.html")
def terror():
    return render_template("refugee.html")

@app.route("/Visual_02.html")
def terror0():
    return render_template("Visual_02.html")

@app.route("/Visual_01.html")
def terror2():
    return render_template("Visual_01.html")

@app.route("/Our_why.html")
def terror3():
    return render_template("Our_Why.html")

if __name__ == "__main__":
    app.run(debug=True)