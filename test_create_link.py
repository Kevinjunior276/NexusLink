import requests

API_URL = "http://localhost:8000/api"

def test_create_link():
    # Login to get token
    login_res = requests.post(f"{API_URL}/login/", json={
        "username": "admin",
        "password": "admin123"
    })
    
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.status_code} {login_res.text}")
        return

    token = login_res.json().get('token')
    headers = {
        "Authorization": f"Token {token}",
        "Content-Type": "application/json"
    }

    # Try to create a link
    payload = {
        "name": "Test Link from Script",
        "submissions_limit": 0
    }
    
    print(f"Testing POST to {API_URL}/links/ with payload: {payload}")
    res = requests.post(f"{API_URL}/links/", json=payload, headers=headers)
    
    print(f"Response Status: {res.status_code}")
    print(f"Response Body: {res.text}")

if __name__ == "__main__":
    test_create_link()
