
import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("JEVMODEL_API_KEY")

if not api_key:
    print("Error: JevModel API key not found.")
    exit()

url = "https://jevmodel.org/v1/systemone"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "model": "jev-latest",
    "state": "Claim: Paris is the capital of France.",
    "questions": {
        "verdict": {
            "type": "choice",
            "instructions": (
                "Based on this claim alone, choose whether "
                "it is likely true or false."
            ),
            "criteria": {
                "likely_true": "The claim is likely true.",
                "likely_false": "The claim is likely false.",
                "uncertain": "There is not enough information."
            }
        }
    }
}

try:
    response = requests.post(
        url,
        headers=headers,
        json=data,
        timeout=30
    )

    print("HTTP status:", response.status_code)
    response.raise_for_status()

    print("JevModel API connection successful!")
    print("Response:", response.json())

except requests.exceptions.RequestException as error:
    print("JevModel API error:", error)
    