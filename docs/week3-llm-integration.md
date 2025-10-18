# Week 5 LLM Integration: Add /generate Endpoint to Week 3 Colab

## Instructions for updating your Week 3 Colab notebook:

### 1. Add this new cell AFTER your existing RAG endpoints:

```python
# Week 5 Integration: Simple Text Generation Endpoint
@app.route('/generate', methods=['POST'])
def generate_text():
    """
    Simple text completion endpoint for Week 5 assistant integration.
    This endpoint provides basic text generation without retrieval.
    """
    try:
        data = request.json

        # Validate required fields
        if not data or 'prompt' not in data:
            return jsonify({
                'error': 'Missing required field: prompt'
            }), 400

        prompt = data['prompt']
        max_tokens = data.get('max_tokens', 150)
        temperature = data.get('temperature', 0.7)

        # Validate parameters
        if not isinstance(prompt, str) or len(prompt.strip()) == 0:
            return jsonify({
                'error': 'Prompt must be a non-empty string'
            }), 400

        if not isinstance(max_tokens, int) or max_tokens < 1 or max_tokens > 500:
            return jsonify({
                'error': 'max_tokens must be an integer between 1 and 500'
            }), 400

        if not isinstance(temperature, (int, float)) or temperature < 0 or temperature > 2:
            return jsonify({
                'error': 'temperature must be a number between 0 and 2'
            }), 400

        # Create assistant-appropriate system prompt
        system_prompt = """You are Alex, a helpful and professional customer support specialist at LiveDrop, an e-commerce company.

Key guidelines:
- Be helpful, friendly, and professional
- Provide clear and concise responses
- Focus on customer service excellence
- Never mention that you are an AI or language model
- If you don't know something specific about LiveDrop policies, offer to connect the customer with a specialist
- Keep responses conversational and natural"""

        # Combine system prompt with user prompt
        full_prompt = f"{system_prompt}\n\nCustomer: {prompt}\nAlex:"

        # Generate response using your existing model
        # Replace this with your actual model generation code from Week 3
        try:
            # Using the same model you set up in Week 3
            inputs = tokenizer(full_prompt, return_tensors="pt", truncation=True, max_length=1000)

            with torch.no_grad():
                outputs = model.generate(
                    inputs.input_ids,
                    max_new_tokens=max_tokens,
                    temperature=temperature,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id,
                    attention_mask=inputs.attention_mask
                )

            # Decode and clean the response
            generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

            # Extract just the assistant's response (after "Alex:")
            if "Alex:" in generated_text:
                response = generated_text.split("Alex:")[-1].strip()
            else:
                response = generated_text[len(full_prompt):].strip()

            # Clean up the response
            response = response.replace("Customer:", "").strip()

            # Ensure response isn't too long
            if len(response) > 500:
                response = response[:497] + "..."

            return jsonify({
                'success': True,
                'response': response,
                'metadata': {
                    'model': 'Week3-Model',
                    'max_tokens': max_tokens,
                    'temperature': temperature,
                    'timestamp': datetime.now().isoformat()
                }
            })

        except Exception as model_error:
            print(f"Model generation error: {str(model_error)}")
            # Fallback response
            return jsonify({
                'success': True,
                'response': "I understand your question. Let me connect you with a specialist who can provide detailed assistance with your specific needs.",
                'metadata': {
                    'model': 'fallback',
                    'fallback_reason': 'model_generation_error',
                    'timestamp': datetime.now().isoformat()
                }
            })

    except Exception as e:
        print(f"Generate endpoint error: {str(e)}")
        return jsonify({
            'error': 'Internal server error during text generation',
            'details': str(e)
        }), 500

# Health check endpoint specifically for Week 5 integration
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Week 5 integration monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'Week3-LLM-Service',
        'endpoints': {
            'rag': '/query',
            'generate': '/generate',
            'health': '/health'
        },
        'timestamp': datetime.now().isoformat()
    })

print("✅ Week 5 integration endpoints added successfully!")
print("📝 Available endpoints:")
print("   - POST /generate (new for Week 5)")
print("   - GET /health (monitoring)")
print("   - POST /query (existing RAG)")
```

### 2. Add required imports at the top of your notebook (if not already present):

```python
from datetime import datetime
import torch
```

### 3. Test the new endpoint:

After adding the code and running the cell, test with:

```python
# Test the new /generate endpoint
import requests

test_prompt = "Hello, I have a question about my order status."

response = requests.post(
    f'{ngrok_url}/generate',
    json={
        'prompt': test_prompt,
        'max_tokens': 100,
        'temperature': 0.7
    }
)

print("Status Code:", response.status_code)
print("Response:", response.json())
```

## Integration Notes:

1. **Keep your existing RAG endpoints** - Don't remove anything from Week 3
2. **The /generate endpoint** provides simple text completion without retrieval
3. **Assistant identity is built-in** - Responses will be from "Alex"
   automatically
4. **Error handling** - Includes fallback responses if model fails
5. **Parameter validation** - Ensures safe input parameters
6. **Health monitoring** - New /health endpoint for system monitoring

## Next Steps:

After adding this to your Colab:

1. Run the cell to register the new endpoints
2. Test the /generate endpoint with a few sample prompts
3. Note your ngrok URL for Week 5 backend integration
4. Proceed to Step 12 (Intelligent Assistant Engine)

Let me know when you've added this to your Colab and have your ngrok URL ready!
