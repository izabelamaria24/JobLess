import os
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
from flask_cors import CORS
from helpers import *
from api_key import API_key
app = Flask(__name__)
CORS(app)


'''
{
    "company": "Google",
    "jobTitle": "Machine learning engineer intern"
}
'''
@app.route("/interviewQuestions", methods=["GET", "POST"])
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
        
'''
{
    companies = ["Google", "Amazon", "Microsoft", "Meta", "Apple"]
    jobTitles = ["Software Engineer", "Data Scientist", "Product Manager", "Machine Learning Engineer", "UX Designer"]
    locations = ["New York", "San Francisco", "Seattle", "Austin", "Los Angeles"]
}
'''
@app.route("/compareSalary", methods=["GET", "POST"])
def compareSalary():
    try:
        data = request.get_json()
        companies = data.get("companies")
        jobTitles = data.get("jobTitles")
        locations = data.get("locations")
        prompt = "Please provide the aproximate salary ranges of the following positions. You can search online. Write a list with the company, job title, location, and salary.\n"
        for i in range(len(companies)):
            prompt += f"Company: {companies[i]}, Job Title: {jobTitles[i]}, Location: {locations[i]}\n"           
        answer = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
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

'''
{
    "path": "/path/to/CV"
}
'''
@app.route("/suggestionsCV", methods=["GET"])
def suggestionsCV():
    try:
        data = request.get_json()
        CV_path = data.get("path")
        CV_text = extract_text_from_pdf(CV_path)
        print(CV_text)
        prompt = f"Please provide suggestions regaring my CV, I want to apply to IT jobs. You can search online. My CV: {CV_text}\n"          
        answer = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=config_with_search)
        grounding = answer.candidates[0].grounding_metadata
        return jsonify({
            "answer": "\n".join([answer.candidates[0].content.parts[i].text for i in range(len(answer.candidates[0].content.parts))]),
            "links": [s.web.uri for s in grounding.grounding_chunks] if grounding.grounding_supports else None,
        })
    except (TypeError, ValueError):
        return jsonify({
            "error": "Please try again with a valid CV path."
        }), 400
        
        
'''
{
    "path": "/path/to/cover_letter.pdf"
}
'''
@app.route("/suggestionsCoverLetter", methods=["GET"])
def suggestionsCoverLetter():
    try:
        data = request.get_json()
        CoverLetter_path = data.get("path")
        #relative_path = os.path.join(os.getcwd(), CoverLetter_path)
        #CoverLetter_text = extract_text_from_pdf(relative_path)
        CoverLetter_text = extract_text_from_pdf(CoverLetter_path)
        prompt = f"Please provide suggestions regaring my Cover Letter, I want to apply to IT jobs. You can search online. My Cover Letter: {CoverLetter_text}\n"          
        answer = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=config_with_search)
        grounding = answer.candidates[0].grounding_metadata
        return jsonify({
            "answer": "\n".join([answer.candidates[0].content.parts[i].text for i in range(len(answer.candidates[0].content.parts))]),
            "links": [s.web.uri for s in grounding.grounding_chunks] if grounding.grounding_supports else None,
        })
    except (TypeError, ValueError):
        return jsonify({
            "error": "Please try again with a valid Cover Letter."
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
