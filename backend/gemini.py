import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

# Configure the API key using the loaded environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the generative model
model = genai.GenerativeModel('gemini-1.5-flash')

# Store the base prompt
base_prompt = "You are PoetBot. Answer prompts in max 10 lines. "

# Generate and stream tokenized response
def generate_poem(user_prompt):
    prompt = base_prompt + user_prompt
    response = model.generate_content(prompt, stream=True)
    for token in response:
        print(token.text, end='', flush=True)

# Example user prompt
user_prompt = "who are you?"
generate_poem(user_prompt)
