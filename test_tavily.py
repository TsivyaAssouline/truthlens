import os
import requests
from dotenv import load_dotenv

# Load the API key from the .env file
load_dotenv()

api_key = os.getenv("TAVILY_API_KEY")

if not api_key:
    print("Error: Tavily API key not found.")
    exit()

# Send a search request to Tavily
url = "https://api.tavily.com/search"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "query": "What is the capital of France?",
    "search_depth": "basic",
    "max_results": 3
}

try:
    response = requests.post(
        url,
        headers=headers,
        json=data,
        timeout=30
    )

    response.raise_for_status()
    results = response.json()

    print("\nTavily search successful!\n")

    for result in results.get("results", []):
        print("Title:", result.get("title", "No title"))
        print("URL:", result.get("url", "No URL"))
        print("Content:", result.get("content", "No content"))
        print("-" * 50)

except requests.exceptions.RequestException as error:
    print("Error while contacting Tavily:", error)