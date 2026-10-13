
from flask import Flask, render_template, request, jsonify
from app.fact_checker import analyze_claim

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/check", methods=["POST"])
def check_claim():
    data = request.get_json(silent=True) or {}
    claim = data.get("claim", "").strip()

    if not claim:
        return jsonify({
            "claim": "",
            "status": "INSUFFICIENT_EVIDENCE",
            "explanation": "Écris une affirmation à vérifier.",
            "sources": []
        }), 400

    result = analyze_claim(claim)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)