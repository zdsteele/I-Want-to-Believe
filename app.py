from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/ufo_data")
def get_ufo_data():
    json_path = "data/ufo_data.json"

    try:
        with open(json_path, "r") as file:
            data = json.load(file)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
