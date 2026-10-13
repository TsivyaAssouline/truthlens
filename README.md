#  TruthLens — AI-Powered Fact Checker

**Think clear. Know better.**

TruthLens is an AI-powered fact-checking web application designed to help users evaluate claims using web-based evidence and AI analysis.

Instead of relying on a single AI opinion, TruthLens combines web research with two independent model assessments to provide a more informed perspective on the claim being investigated.

## ✨ Features

* **Web-based research:** Retrieves relevant information from online sources using Tavily.
* **AI-powered fact-checking:** Uses Google Gemini to analyze claims against the available evidence.
* **Independent second opinion:** Integrates JevModel to provide an additional assessment.
* **Evidence-backed results:** Displays the sources used during the verification process.
* **Clear verdicts:** Distinguishes between supported claims, refuted claims, and claims for which there is insufficient evidence.
* **Verification history:** Saves previous checks in the browser so users can revisit their results.
* **Interactive web interface:** A dark, purple-themed interface designed for a clean and intuitive user experience.

## 🛠️ Technologies

| Technology    | Purpose                            |
| ------------- | ---------------------------------- |
| Python        | Backend logic                      |
| Flask         | Web application and API            |
| Google Gemini | AI-based claim analysis            |
| Tavily        | Web search and evidence retrieval  |
| JevModel      | Independent second opinion         |
| HTML & CSS    | User interface and styling         |
| JavaScript    | Frontend interactions              |
| Local Storage | Browser-based verification history |
| python-dotenv | Environment variable management    |

## 🔍 How It Works

1. **Submit a claim:** The user enters a statement to verify.
2. **Retrieve evidence:** Tavily searches the web for potentially relevant sources.
3. **Analyze the claim:** Gemini evaluates the claim using the retrieved evidence.
4. **Get a second opinion:** JevModel provides an additional assessment.
5. **Review the results:** TruthLens displays the verdict, explanation, supporting sources, and second-opinion information.

### Possible Verdicts

* `SUPPORTED` — The available evidence supports the claim.
* `REFUTED` — The available evidence contradicts the claim.
* `INSUFFICIENT_EVIDENCE` — The available evidence is not sufficient to reach a reliable conclusion.

TruthLens is an assistance tool, not a guarantee of truth. Results depend on the quality, relevance, and availability of sources and on the limitations of the AI models.

## 🏗️ Project Structure

```text
ai-fact-checker/
├── app/
│   ├── main.py
│   └── fact_checker.py
├── static/
│   ├── script.js
│   ├── style.css
│   └── truthlens_logo.png
├── templates/
│   └── index.html
├── .env
├── .gitignore
├── README.md
├── test_gemini.py
├── test_jev.py
├── test_tavily.py
└── web_app.py
```


The `.env` file is intentionally excluded from version control because it contains API credentials.

## 🚀 Getting Started

### Prerequisites

* Python 3.11 or later, subject to dependency compatibility
* Git
* API keys for Tavily, Google Gemini, and JevModel

### 1. Clone the Repository


git clone https://github.com/YOUR_USERNAME/truthlens.git
cd truthlens


Replace `YOUR_USERNAME` with your GitHub username and `truthlens` with your chosen repository name.

### 2. Create a Virtual Environment

**Windows — PowerShell**


python -m venv .venv
.\.venv\Scripts\Activate.ps1


If PowerShell blocks activation, run:


Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1


### 3. Install Dependencies


python -m pip install flask requests python-dotenv google-genai


### 4. Configure Environment Variables

Create a `.env` file in the project root, alongside `web_app.py`.

Add your API keys:


TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key
JEVMODEL_API_KEY=your_jevmodel_api_key


Replace the example values with your own credentials. Never share your API keys or commit the `.env` file to GitHub.

### 5. Run the Application


python web_app.py

Open your browser and navigate to:

http://127.0.0.1:5000

## 🎬 Demo

Watch TruthLens in action:

[▶️ Watch the TruthLens demo](https://drive.google.com/file/d/1zZllj_xFRBNtqAYirveAii8Pbd4YjwPV/view?usp=sharing)


## 🔐 Security

* API keys are stored in environment variables rather than hardcoded in the source code.
* `.env` and `.venv/` must be excluded from version control.
* Never publish API keys, passwords, or other secrets.
* If an API key is accidentally exposed, revoke it and generate a replacement.

## 🗺️ Future Improvements

* Add automated tests for the verification pipeline.
* Improve source relevance and evidence quality evaluation.
* Add source credibility indicators.
* Improve error handling and response times.
* Deploy the application so it can be accessed online.

## 👩‍💻 About the Project

TruthLens is a personal software development project exploring the use of AI, web research, and multiple model assessments to support critical thinking and evidence-based decision-making.

**Question what you see. Verify before you believe.**
