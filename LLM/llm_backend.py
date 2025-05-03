import os
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
from helpers import *
from api_key import API_key
app = Flask(__name__)

'''
{
    "company": "Google",
    "jobTitle": "Machine learning engineer intern"
}
'''
@app.route("/interviewQuestions", methods=["GET"])
def interviewQuestions():
    try:
        data = request.get_json()
        company = data.get("company")
        jobTitle = data.get("jobTitle")
        answer = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"I am interviewing for {jobTitle} at the company {company}. Please provide interview questions so I can prepare for the interview. You can search online. Write 10 questions.",
        config=config_with_search)
        grounding = answer.candidates[0].grounding_metadata
        return jsonify({
            "answer": "\n".join([answer.candidates[0].content.parts[i].text for i in range(len(answer.candidates[0].content.parts))]),
            "links": [s.web.uri for s in grounding.grounding_chunks] if grounding.grounding_supports else None,
        })
    except (TypeError, ValueError):
        return jsonify({
            "error": "Please try again with a valid company and job title."
        }), 400
        
        
def init_client():
    client = genai.Client(api_key=API_key)
    config_with_search = types.GenerateContentConfig(
    tools=[types.Tool(google_search=types.GoogleSearch())],
    temperature=0.0,
    max_output_tokens=512
    )
    return client, config_with_search

if __name__ == "__main__":
    client, config_with_search = init_client()
    app.run(debug=True, port=5555)
