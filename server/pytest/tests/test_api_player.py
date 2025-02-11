import os
import requests
import pytest
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:5000"

USER_EMAIL = "obby@test.com"
USER_PASSWORD = "maman123456"

SPOTIFY_TRACK_ID = "3di5hcvxxciiqwMH1jarhY"

@pytest.fixture(scope="session")
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

def get_headers(jwt_token, spotify_access_token):
    return {
        "Authorization": f"Bearer {spotify_access_token}",
        "User-Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
    }

def test_play_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/play/{SPOTIFY_TRACK_ID}"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.put(url, headers=headers)

    print(f"Play Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Play track failed: {response.text}"

def test_pause_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/pause"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.put(url, headers=headers)

    print(f"Pause Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Pause failed: {response.text}"

def test_next_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/next"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.post(url, headers=headers)

    print(f"Next Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Next track failed: {response.text}"

def test_previous_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/previous"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.post(url, headers=headers)

    print(f"Previous Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Previous track failed: {response.text}"

def test_shuffle_tracks(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/shuffle"
    headers = get_headers(jwt_token, spotify_access_token)
    data = {"state": True} 

    response = requests.put(url, json=data, headers=headers)

    print(f"Shuffle Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Shuffle failed: {response.text}"

def test_resume_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/resume"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.put(url, headers=headers)

    print(f"Resume Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Resume failed: {response.text}"

def test_queue_track(jwt_token, spotify_access_token):
    url = f"{BASE_URL}/api/spotify/queue/{SPOTIFY_TRACK_ID}"
    headers = get_headers(jwt_token, spotify_access_token)

    response = requests.post(url, headers=headers)

    print(f"Queue Track Response: {response.status_code}, {response.text}")
    assert response.status_code == 200, f"Queue track failed: {response.text}"
