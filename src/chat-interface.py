import requests

BASE_URL = "https://erik-unkindhearted-shonta.ngrok-free.dev"  # ← no trailing space!

def chat(query):
    """
    Sends a query to the Flask /chat endpoint and returns the response.
    """
    payload = {"prompt": query}
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("Welcome to Shoplite Chat! Type 'exit' or 'quit' to end.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        result = chat(user_input)
        if "error" in result:
            print("Error:", result["error"])
        else:
            print("Bot:", result.get("response", "No answer returned"))
        print("-" * 50)