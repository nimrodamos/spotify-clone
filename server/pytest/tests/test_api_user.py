import requests
import pytest

BASE_URL = "https://localhost:5000" 
NEW_DISPLAY_NAME = "UpdatedUser123"
FOLLOW_USER_ID = "679cdd1cec56e9dfb60cbf99" 
CHANGE_USER_DETAILS_ID = "678dc41f848f75bd2ed99408"

def test_login_user():
    """ Test user login and retrieve session with JWT cookie """
    url = f"{BASE_URL}/api/users/login"
    data = {
        "email": "obby@test.com",
        "password": "maman123456"
    }

    global session 
    session = requests.Session()
    response = session.post(url, json=data)

    print(f"Login Response: {response.status_code}, {response.text}")

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert "Set-Cookie" in response.headers, "No Set-Cookie header received"

    cookies = session.cookies.get_dict()
    assert "jwt" in cookies, "JWT cookie not found in response"

    print(f"JWT Cookie Retrieved: {cookies['jwt']}")

@pytest.fixture(scope="session")
def jwt_token():
    """ Extracts JWT from cookies after login and returns it """
    return session.cookies.get("jwt")

def test_get_user(jwt_token):
    """ Test retrieving user profile using JWT in headers """
    url = f"{BASE_URL}/api/users/UpdatedUser123"
    headers = {
        'Cookie': f'jwt={jwt_token}'
    }
    response = requests.get(url, headers=headers)

    print(f"Get User Response: {response.status_code}, {response.text}") 
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"

def test_update_user(jwt_token):
    """ Test updating the user's display name """
    url = f"{BASE_URL}/api/users/{CHANGE_USER_DETAILS_ID}/" 
    headers = {
        'Cookie': f'jwt={jwt_token}',
        'Content-Type': 'application/json'
    }
    data = {"displayName": NEW_DISPLAY_NAME}

    response = requests.put(url, json=data, headers=headers)

    print(f"Update Display Name Response: {response.status_code}, {response.text}") 
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("displayName") == NEW_DISPLAY_NAME, "Display name did not update correctly"

def test_follow_unfollow_user(jwt_token):
    """ Test following and unfollowing a user """
    url = f"{BASE_URL}/api/users/{FOLLOW_USER_ID}/follow" 
    headers = {
        'Cookie': f'jwt={jwt_token}'
    }

    response = requests.post(url, headers=headers)

    print(f"Follow/Unfollow Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"

    # Verify response message
    follow_message = response.json().get("message")
    assert follow_message in ["User followed successfully", "User unfollowed successfully"], f"Unexpected response: {follow_message}"

def test_logout_user():
    """ Test user logout using JWT stored in cookies """
    url = f"{BASE_URL}/api/users/logout"
    response = session.post(url)  # Use stored session with cookies

    print(f"Logout Response: {response.status_code}, {response.text}")  # Debugging output
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "User logged out successfully"
