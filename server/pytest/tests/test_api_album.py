import requests
import pytest

BASE_URL = "https://localhost:5000"
TEST_ALBUM_ID = "5g0rUrIUZCeZ0CRviWXQf6"
TEST_ALBUM_NAME = "Future Nostalgia" 
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

def test_get_all_albums():
    """Tests fetching all albums."""
    response = requests.get(f"{BASE_URL}/api/albums")
    assert response.status_code == 200, f"Failed to fetch albums: {response.text}"
    assert isinstance(response.json(), list), "Albums response is not a list"

def test_get_album_by_id(session_with_tokens):
    """Tests fetching an album by ID."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/albums/{TEST_ALBUM_ID}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch album: {response.text}"
    assert response.json().get("spotifyAlbumId") == TEST_ALBUM_ID, "Album ID mismatch"

def test_get_album_by_name(session_with_tokens):
    """Tests fetching an album by name."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/albums/name/{TEST_ALBUM_NAME}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch album by name: {response.text}"
    assert response.json().get("name").lower() == TEST_ALBUM_NAME.lower(), "Album name mismatch"

def test_get_limited_albums():
    """Tests fetching a limited number of albums."""
    response = requests.get(f"{BASE_URL}/api/albums/limited?limit=5")
    assert response.status_code == 200, f"Failed to fetch limited albums: {response.text}"
    assert isinstance(response.json(), list) and len(response.json()) <= 5, "Did not return correct limit of albums"

def test_get_albums_with_offset():
    """Tests fetching albums with offset and limit."""
    response = requests.get(f"{BASE_URL}/api/albums/offset?offset=0&limit=10")
    assert response.status_code == 200, f"Failed to fetch albums with offset: {response.text}"

    json_response = response.json()
    assert "data" in json_response, "Missing 'data' key in response"
    assert isinstance(json_response["data"], list), "Data is not a list"
    assert "hasMore" in json_response, "Missing 'hasMore' key in response"
