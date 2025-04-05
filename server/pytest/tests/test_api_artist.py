import requests
import pytest

BASE_URL = "https://localhost:5000"
TEST_ARTIST_ID = "677bc41236324425b93ad8c1" 
TEST_ARTIST_NAME = "Drake" 
TEST_SPOTIFY_URL = "5WUlDfRSoLAfcVSX1WnrxN" 

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

def test_get_all_artists():
    """Tests fetching all artists."""
    response = requests.get(f"{BASE_URL}/api/artists")
    assert response.status_code == 200, f"Failed to fetch artists: {response.text}"
    assert isinstance(response.json(), list), "Artists response is not a list"

def test_get_artist_by_id(session_with_tokens):
    """Tests fetching an artist by ID."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/artists/{TEST_ARTIST_ID}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch artist: {response.text}"
    assert response.json().get("_id") == TEST_ARTIST_ID, "Artist ID mismatch"

def test_get_artist_by_name(session_with_tokens):
    """Tests fetching an artist by name."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/artists/name/{TEST_ARTIST_NAME}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch artist: {response.text}"
    assert response.json().get("name").lower() == TEST_ARTIST_NAME.lower(), "Artist name mismatch"

def test_get_limited_artists():
    """Tests fetching a limited number of artists."""
    response = requests.get(f"{BASE_URL}/api/artists/limited?limit=5")
    assert response.status_code == 200, f"Failed to fetch limited artists: {response.text}"
    assert isinstance(response.json(), list) and len(response.json()) <= 5, "Did not return correct limit of artists"

def test_get_artists_with_offset():
    """Tests fetching artists with offset and limit."""
    response = requests.get(f"{BASE_URL}/api/artists/offset?offset=0&limit=10")
    assert response.status_code == 200, f"Failed to fetch artists with offset: {response.text}"

    json_response = response.json()
    assert "data" in json_response, "Missing 'data' key in response"
    assert isinstance(json_response["data"], list), "Data is not a list"
    assert "hasMore" in json_response, "Missing 'hasMore' key in response"

def test_get_artist_by_spotify_url(session_with_tokens):
    """Tests fetching an artist by Spotify URL."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/artists/spotify/{TEST_SPOTIFY_URL}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch artist by Spotify URL: {response.text}"
    assert response.json().get("external_urls", {}).get("spotify").endswith(TEST_SPOTIFY_URL), \
        "Artist Spotify URL mismatch"