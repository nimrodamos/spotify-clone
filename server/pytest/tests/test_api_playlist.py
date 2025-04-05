import requests
import pytest

BASE_URL = "https://localhost:5000"
TEST_SPOTIFY_TRACK_ID = "3di5hcvxxciiqwMH1jarhY"

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

@pytest.fixture(scope="session")
def test_playlist(session_with_tokens):
    """Creates a playlist and returns its ID."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Content-Type": "application/json"
    }

    playlist_data = {
        "PlaylistTitle": "My Test Playlist",
        "description": "A test playlist",
        "customAlbumCover": "https://testcover.com/image.jpg",
        "isPublic": True
    }

    response = session.post(f"{BASE_URL}/api/playlists", json=playlist_data, headers=headers)
    assert response.status_code == 201, f"Failed to create playlist: {response.text}"

    playlist_id = response.json().get("_id")
    assert playlist_id, "Playlist ID not returned"

    return playlist_id

def test_get_playlist_by_id(session_with_tokens, test_playlist):
    """Tests fetching a playlist by ID."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.get(f"{BASE_URL}/api/playlists/{test_playlist}", headers=headers)

    assert response.status_code == 200, f"Failed to fetch playlist: {response.text}"
    assert response.json().get("PlaylistTitle") == "My Test Playlist", "Playlist title mismatch"

def test_update_playlist(session_with_tokens, test_playlist):
    """Tests updating a playlist."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {
        "Cookie": f"jwt={jwt_token}",
        "Content-Type": "application/json"
    }

    update_data = {
        "PlaylistTitle": "Updated Playlist Title",
        "description": "Updated description"
    }

    response = session.put(f"{BASE_URL}/api/playlists/{test_playlist}", json=update_data, headers=headers)
    assert response.status_code == 200, f"Failed to update playlist: {response.text}"

    updated_data = response.json()
    assert updated_data.get("PlaylistTitle") == "Updated Playlist Title", "Playlist title was not updated"
    assert updated_data.get("description") == "Updated description", "Description was not updated"

def test_add_track_to_playlist(session_with_tokens, test_playlist):
    """Tests adding a track to a playlist."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.put(f"{BASE_URL}/api/playlists/{test_playlist}/playlist/{TEST_SPOTIFY_TRACK_ID}", headers=headers)

    assert response.status_code == 200, f"Failed to add track to playlist: {response.text}"
    assert any(track["spotifyTrackId"] == TEST_SPOTIFY_TRACK_ID for track in response.json()["tracks"]), \
        "Track not added to playlist"

def test_delete_track_from_playlist(session_with_tokens, test_playlist):
    """Tests removing a track from a playlist."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.delete(f"{BASE_URL}/api/playlists/{test_playlist}/playlist/{TEST_SPOTIFY_TRACK_ID}", headers=headers)

    assert response.status_code == 200, f"Failed to delete track from playlist: {response.text}"
    assert not any(track["spotifyTrackId"] == TEST_SPOTIFY_TRACK_ID for track in response.json()["tracks"]), \
        "Track not removed from playlist"

def test_get_public_playlists():
    """Tests fetching public playlists."""
    response = requests.get(f"{BASE_URL}/api/playlists")
    assert response.status_code == 200, f"Failed to fetch public playlists: {response.text}"

def test_delete_playlist(session_with_tokens, test_playlist):
    """Tests deleting a playlist."""
    jwt_token = session_with_tokens["jwt_token"]
    session = session_with_tokens["session"]

    headers = {"Cookie": f"jwt={jwt_token}"}
    response = session.delete(f"{BASE_URL}/api/playlists/{test_playlist}", headers=headers)

    assert response.status_code == 200, f"Failed to delete playlist: {response.text}"

    response = session.get(f"{BASE_URL}/api/playlists/{test_playlist}", headers=headers)
    assert response.status_code == 404, "Playlist was not deleted successfully"
