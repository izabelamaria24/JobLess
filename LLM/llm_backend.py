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

@app.route("/interviewQuestions", methods=["POST"])
def interviewQuestions():
    try:
        data = request.get_json()
        company = data.get("company")
        jobTitle = data.get("jobTitle")
        
        prompt = (
            f"You are a software engineer at {company} who has to conduct interviews with candidates "
            f"for a position of {jobTitle}. In order to prepare for these interviews, you need to have a set "
            f"of questions prepared. You are allowed to search online in order to prepare a comprehensive list "
            f"of questions.\n\n"
            f"A question should have the following structure: "
            f'[{{"title": "", "category": "", "contents": ""}}]. '
            f"Title should be filled with a concise title of the question and category with one of these categories: "
            f"Algorithms, Data Structures, System Design, Multithreading, OOP, Functional Programming. "
            f"The field contents should contain the full question.\n\n"
            f"Respond with the full list of questions using this structure only: "
            f'[{{"title": "", "category": "", "contents": ""}}, ...]. '
            f"Do not write any additional text. Be concise and brief in your answers."
        )

        answer = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=config_with_search
        )

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
        data = request.get_json().get("data")
        companies = data.get("companies")
        jobTitles = data.get("jobTitles")
        locations = data.get("locations")
        prompt = (
            "You are a salary research assistant who has access to online salary databases and public compensation reports. "
            "Your task is to look up and summarize the **approximate salary ranges** (base salary only is fine) for a series of tech roles. "
            "You are allowed to search online to provide realistic and recent estimates based on location, company, and role.\n\n"
            "For each job listed below, provide the following fields:\n"
            "- Company\n"
            "- Job Title\n"
            "- Location\n"
            "- Approximate Annual Salary Range in USD (e.g., $120,000 - $150,000)\n\n"
            "Respond strictly in a JSON list format like this:\n"
            '[{"company": "Company Name", "jobTitle": "Job Title", "location": "Location", "salary": "Salary Range"}, ...]\n\n'
            "Here is the list of positions to analyze:\n"
        )

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
@app.route("/suggestionsCV", methods=["POST"])
def suggestionsCV():
    try:
        data = request.get_json()
        cv_rel_path = data.get("path")
        print("Received CV path:", cv_rel_path)
        if not cv_rel_path:
            return jsonify({"error": "Missing CV path."}), 400

        base_dir = os.path.dirname(os.path.abspath(__file__))
        wwwroot_dir = os.path.abspath(os.path.join(base_dir, "..", "backend", "wwwroot"))
        full_cv_path = os.path.join(wwwroot_dir, cv_rel_path.lstrip("/"))
        print("Full CV path:", full_cv_path)

        try:
            cv_text = extract_text_from_pdf(full_cv_path)
        except FileNotFoundError:
            return jsonify({"error": "CV file not found."}), 404
        except Exception as e:
            return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

        print(cv_text)

        prompt = (
            "Please provide suggestions regarding my CV, I want to apply to IT jobs. "
            "You can search online. My CV: " + cv_text + "\n"
        )
        answer = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=config_with_search
        )
        grounding = answer.candidates[0].grounding_metadata

        return jsonify({
            "answer": "\n".join([part.text for part in answer.candidates[0].content.parts]),
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
        print("Received Cover Letter path:", CoverLetter_path)
        if not CoverLetter_path:
            return jsonify({"error": "Missing Cover Letter path."}), 400

        base_dir = os.path.dirname(os.path.abspath(__file__))
        wwwroot_dir = os.path.abspath(os.path.join(base_dir, "..", "backend", "wwwroot"))
        full_cover_letter_path = os.path.join(wwwroot_dir, CoverLetter_path.lstrip("/"))
        print("Full Cover Letter path:", full_cover_letter_path)

        CoverLetter_text = extract_text_from_pdf(full_cover_letter_path)
        prompt = f"Please provide suggestions regaring my Cover Letter, I want to apply to IT jobs. You can search online. My Cover Letter: {CoverLetter_text}\n"          
        answer = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=config_with_search
        )
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
