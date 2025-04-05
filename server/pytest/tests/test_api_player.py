import requests
import pytest

BASE_URL = "https://localhost:5000"
TEST_TRACK_ID = "3di5hcvxxciiqwMH1jarhY"
TEST_QUEUE_TRACK_ID = "1Jx6aZyJR985kw8CWUZ15O" 

@pytest.fixture(scope="session")
def session_with_tokens():
    """Logs in the user and retrieves both JWT and Spotify access token."""
    login_url = f"{BASE_URL}/api/users/login"
    login_data = {
        "email": "obby@test.com", 
        "password": "maman123456"
    }

    session = requests.Session()
    response = session.post(login_url, json=login_data)

    assert response.status_code == 200, f"Login failed: {response.text}"
    
    jwt_cookie = session.cookies.get("jwt")
    assert jwt_cookie, "JWT token not found in cookies"

    token_url = f"{BASE_URL}/api/users/UpdatedUser123"
    headers = {"Cookie": f"jwt={jwt_cookie}"}
    
    response = session.get(token_url, headers=headers)
    assert response.status_code == 200, f"Fetching user profile failed: {response.text}"

    access_token = response.json().get("accessToken")
    assert access_token, "Spotify access token not found in response"

    return {
        "session": session,
        "jwt_token": jwt_cookie,
        "access_token": access_token
    }

def test_play_track(session_with_tokens):
    """Tests playing a track using JWT and Spotify Access Token."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    play_url = f"{BASE_URL}/api/spotify/play/{TEST_TRACK_ID}"
    response = requests.put(play_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Track is now playing.", "Track did not start playing"

def test_pause_track(session_with_tokens):
    """Tests pausing a currently playing track."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    pause_url = f"{BASE_URL}/api/spotify/pause"
    response = requests.put(pause_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Playback paused.", "Track did not pause"

def test_resume_track(session_with_tokens):
    """Tests resuming playback of a paused track."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    resume_url = f"{BASE_URL}/api/spotify/resume"
    response = requests.put(resume_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Playback resumed.", "Track did not resume"

def test_skip_to_next_track(session_with_tokens):
    """Tests skipping to the next track."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    next_url = f"{BASE_URL}/api/spotify/next"
    response = requests.post(next_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Skipped to the next track.", "Track did not skip"

def test_previous_track(session_with_tokens):
    """Tests going back to the previous track."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    previous_url = f"{BASE_URL}/api/spotify/previous"
    response = requests.post(previous_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Rewound to the previous track.", "Track did not rewind"

def test_shuffle_tracks(session_with_tokens):
    """Tests enabling shuffle mode."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    shuffle_url = f"{BASE_URL}/api/spotify/shuffle"
    shuffle_data = {"state": True}

    response = requests.put(shuffle_url, json=shuffle_data, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message").lower() == "shuffle set to true.", "Shuffle mode did not activate"

def test_queue_track(session_with_tokens):
    """Tests adding a track to the queue."""
    jwt_token = session_with_tokens["jwt_token"]
    access_token = session_with_tokens["access_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    queue_url = f"{BASE_URL}/api/spotify/queue/{TEST_QUEUE_TRACK_ID}"
    response = requests.post(queue_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "Track has been added to the queue.", "Track did not queue"

def test_logout_user(session_with_tokens):
    """Tests logging out the user and clearing JWT."""
    session = session_with_tokens["session"]

    logout_url = f"{BASE_URL}/api/users/logout"
    response = session.post(logout_url)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert response.json().get("message") == "User logged out successfully", "Logout did not complete"
