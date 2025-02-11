import requests
import pytest

BASE_URL = "http://localhost:5000"  # Change this to match your API URL

@pytest.fixture(scope='session')
def access_token():
    url = f"{BASE_URL}/api/users/login"
    data = {
        "email": "obby@test.com",
        "password": "maman123456"
    }
    response = requests.post(url, json=data)
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    response_body = response.json()
    accessToken = response_body.get("accessToken")
    assert accessToken, "Login failed, no access token returned"
    return accessToken

def test_get_user():
    url = f"{BASE_URL}/api/users/Obby"
    response = requests.get(url)
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"

def test_login_user(access_token):
    assert access_token, "Login failed, no access token returned"

def test_logout_user(access_token):
    url = f"{BASE_URL}/api/users/logout"
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.post(url, headers=headers)
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
