
import os
from dotenv import load_dotenv
from google import genai

# Load API keys from the .env file
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: Gemini API key not found.")
    exit()

try:
    # Create a Gemini client
    client = genai.Client(api_key=api_key)

    # Send a test question using the new Interactions API
    response = client.interactions.create(
        model="gemini-3.8-flash",
        input="Answer in French: What is the capital of France?"
    )

    print("Gemini API connection successful!")
    print("Response:", response.output_text)

except Exception as error:
    print("Gemini API error:", error)