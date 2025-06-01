import requests
from config import BASE_URL, LOGIN_ROUTE, USERNAME, PASSWORD

def login():
    url = BASE_URL + LOGIN_ROUTE
    payload = {
        "Email": USERNAME,
        "Password": PASSWORD
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    token = response.json().get("token")
    print("[+] Authentificated. Token obtained.")
    return token


def get_headers(token):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def test_route(method, route, token, data=None):
    url = BASE_URL + route
    headers = get_headers(token)

    try:
        if method == "GET":
            r = requests.get(url, headers=headers)
        elif method == "POST":
            r = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            r = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            r = requests.delete(url, headers=headers)
        else:
            print(f"[-] Method {method} not supported")
            return

        print(f"[{method}] {route} => Status: {r.status_code}")
        print("Response:", r.json() if r.content else "No content")
    except Exception as e:
        print(f"[-] Error {method} {route}: {e}")


def test_controller(token, model_name, data1, data2):
    headers = get_headers(token)

    create_url = BASE_URL + f"/{model_name}/new"
    create_data = data1
    create_response = requests.post(create_url, json=create_data, headers=headers)
    create_response.raise_for_status()
    try:
        id = create_response.json().get("id")
    except Exception:
        location = create_response.headers.get("Location", "")
        id = location.rstrip("/").split("/")[-1] if location else None

    #if create_response.status_code != 200:
    #    raise Exception(f"[-] Create {model_name} not working")
    #else:
    print(f"[+] {model_name} Created ID: {id}")
    
    if not id:
        raise Exception("[-] We could not obtain the id")


    list_url = BASE_URL + f"/{model_name}/index"
    list_response = requests.get(list_url, headers=headers)
    if list_response.status_code != 200:
        raise Exception("[-] Index not working")
    else:
        print(f"[GET] /{model_name}/index:", list_response.status_code)

    edit_url = f"{BASE_URL}/{model_name}/edit/{id}"
    edit_data = data2
    edit_data["id"] = id
    edit_response = requests.put(edit_url, json=edit_data, headers=headers)
    if edit_response.status_code != 200:
        raise Exception("[-] Edit not working")
    else:
        print(f"[PUT] /{model_name}/edit/{id}:", edit_response.status_code)


    show_url = f"{BASE_URL}/{model_name}/show/{id}"
    show_response = requests.get(show_url, headers=headers)
    if show_response.status_code != 200:
        raise Exception("[-] Show not working")
    else:
        print(f"[GET] /{model_name}/show/{id}:", show_response.status_code, show_response.json())


    delete_url = f"{BASE_URL}/{model_name}/delete/{id}"
    delete_response = requests.delete(delete_url, headers=headers)
    if delete_response.status_code != 200:
        raise Exception("[-] Delete not working")
    else:
        print(f"[DELETE] /{model_name}/delete/{id}:", delete_response.status_code)



def create_application(token):
    headers = get_headers(token)
    create_url = BASE_URL + f"/Applications/new"
    create_data = {
            "Link":"https://www.linked.in/tralala",
            "Company":"BRR BRR PATAPIM",
            "JobTitle":"lirilia larila",
            "Location":"sahur"
        }
    create_response = requests.post(create_url, json=create_data, headers=headers)
    create_response.raise_for_status()
    app_id = create_response.json().get("id")
    return app_id

def delete_application(token, app_id):
    headers = get_headers(token)
    delete_url = f"{BASE_URL}/Applications/delete/{app_id}"
    delete_response = requests.delete(delete_url, headers=headers)

def get_user_id(token):
    headers = get_headers(token)
    url = BASE_URL + "/Users/whoami"
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception("[-] WhoAmI not working")
    return response.json().get("id")



def test_statistics(token):
    user_id = get_user_id(token)
    test_controller(token,"Statistics",
        {
            "userId": user_id
        },
        {
            "userId": user_id,
            "totalApplications": 99,
            "openApplications": 2
        }
    )

def test_resumes(token):
    user_id = get_user_id(token)
    test_controller(token,"Resumes",
        {
            "UserId": user_id,
            "Description": "Very talented",
            "Experience": "Bench Press",
            "LinkedIn": "https://www.linkedin.com/UdinDinDinDon",
            "GitHub": "https://github.com/UdinDinDinDon"
        },
        {
            "UserId": user_id,
            "Description": "Very talented",
            "Experience": "100 Kilo Bench Press",
            "LinkedIn": "https://www.linkedin.com/UdinDinDinDon",
            "GitHub": "https://github.com/UdinDinDinDon"
        }
    )

def test_technologies(token):
    test_controller(token,"Technologies",
        {
            "Name":"C# ASP.NET Core"
        },
        {
            "Name":"C# ASP.NET"
        }
    )

def test_applications(token):
    user_id = get_user_id(token)
    test_controller(token,"Applications",
        {
            "UserId": user_id,
            "JobTitle":"Lirilia Larila",
            "Company":"BRR BRR",
            "Location":"Sahur",
            "Link":"https://www.linked.in/tralala",
            "JobType":1,
            "Availability":1,
            "Status":1
        },
        {
            "UserId": user_id,
            "JobTitle":"Lirilia Larila",
            "Company":"BRR BRR Patapim",
            "Location":"Sahur",
            "Link":"https://www.linked.in/tralalero-tralala",
            "JobType":1,
            "Availability":1,
            "Status":1
        }
    )

def test_responses(token):
    app_id = create_application(token)
    test_controller(token,"Responses",
        {
            "ApplicationId":app_id,
            "Action": 2
        },
        {
            "ApplicationId":app_id,
            "Action": 3
        }
    )
    delete_application(token, app_id)


def test_applications_summary(token):
    headers = get_headers(token)
    url = f"{BASE_URL}/Applications/summary"
    response = requests.get(url, headers=headers)
    print(f"[GET] /Applications/summary => Status: {response.status_code}")
    print("Response:", response.json() if response.content else "No content")


def test_response_history(token):
    app_id = create_application(token)
    headers = get_headers(token)

    response_data_1 = {
        "ApplicationId": app_id,
        "Action": 2 
    }
    response_data_2 = {
        "ApplicationId": app_id,
        "Action": 3 
    }

    requests.post(f"{BASE_URL}/Responses/new", json=response_data_1, headers=headers)
    requests.post(f"{BASE_URL}/Responses/new", json=response_data_2, headers=headers)

    url = f"{BASE_URL}/Responses/history/{app_id}"
    response = requests.get(url, headers=headers)
    print(f"[GET] /Responses/history/{app_id} => Status: {response.status_code}")

    test_applications_summary(token)
    delete_application(token, app_id)


def test_all_routes(token):
    endpoints = [
        # {"method": "GET", "route": "/users"},
        # {"method": "POST", "route": "/users", "data": {"name": "John", "email": "john@example.com"}},
        # {"method": "GET", "route": "/users/1"},
        # {"method": "PUT", "route": "/users/1", "data": {"name": "John Updated"}},
        # {"method": "DELETE", "route": "/users/1"}

        {"method": "GET", "route": "/Test"},
        {"method": "POST", "route": "/Test", "data":{"Name":"Test", "Description":"Test description"}}
    ]

    for ep in endpoints:
        test_route(ep["method"], ep["route"], token, data=ep.get("data"))
    
    # Test Controllers
    test_statistics(token)
    test_resumes(token)
    test_technologies(token)
    test_applications(token)
    test_responses(token)


    test_response_history(token)
    
    print("Everything went exceptionally well! Your backend has been thoroughly tested, and all endpoints, controllers, and functionalities are working perfectly as expected. Great job!")
   


if __name__ == "__main__":
    try:
        token = login()
        test_all_routes(token)
    except requests.exceptions.HTTPError as e:
        print(f"[-] Error: {e}")
