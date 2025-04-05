import requests
import pytest

BASE_URL = "https://localhost:5000"
TEST_TRACK_ID = "1Jx6aZyJR985kw8CWUZ15O"
TEST_ARTIST_NAME = "Drake"  

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

def test_get_all_tracks():
    """Tests fetching all tracks."""
    response = requests.get(f"{BASE_URL}/api/tracks")
    assert response.status_code == 200, f"Failed to fetch tracks: {response.text}"
    assert isinstance(response.json(), list), "Tracks response is not a list"

def test_get_track_by_id(session_with_tokens):
    """Tests fetching a track by ID."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/tracks/{TEST_TRACK_ID}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch track: {response.text}"
    assert response.json().get("spotifyTrackId") == TEST_TRACK_ID, "Track ID mismatch"

def test_get_tracks_by_artist(session_with_tokens):
    """Tests fetching tracks by artist name."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/tracks/artist/{TEST_ARTIST_NAME}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch tracks by artist: {response.text}"
    assert isinstance(response.json(), list) and len(response.json()) > 0, "No tracks found for artist"

def test_get_tracks_with_offset():
    """Tests fetching tracks with offset and limit."""
    response = requests.get(f"{BASE_URL}/api/tracks/offset?offset=0&limit=10")
    assert response.status_code == 200, f"Failed to fetch tracks with offset: {response.text}"

    json_response = response.json()
    assert "data" in json_response, "Missing 'data' key in response"
    assert isinstance(json_response["data"], list), "Data is not a list"
    assert "hasMore" in json_response, "Missing 'hasMore' key in response"
