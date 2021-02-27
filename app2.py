from flask import (
    Flask,
    g,
    redirect,
    render_template,
    request,
    url_for,
    jsonify,
)
import pandas as pd
#import sqlite3
from sqlalchemy import create_engine

database_path = "population.sqlite"
database_path2 = "countries.sqlite"
database_path3 = "terrorism_data.sqlite"



app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/terror.html")
def terror():
    return render_template("terror.html")


@app.route("/API")
def population_sqlite():
    engine = create_engine(f"sqlite:///{database_path}")
    conn = engine.connect()
    data = pd.read_sql('SELECT * FROM "population"', conn)

    return jsonify(data.to_dict("records"))

@app.route("/Countries_API")
def countries_sqlite():
    engine = create_engine(f"sqlite:///{database_path2}")
    conn = engine.connect()
    data = pd.read_sql('SELECT * FROM "countries"', conn)

    return jsonify(data.to_dict("records"))

@app.route("/Terrorism_API")
def terrorism_sqlite():
    engine = create_engine(f"sqlite:///{database_path3}")
    conn = engine.connect()
    data = pd.read_sql('SELECT * FROM "terrorism_data"', conn)

    return jsonify(data.to_dict("records"))


if __name__ == "__main__":
    app.run(debug=True)