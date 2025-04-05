import os
import asyncio
import requests
import pytest
from pyppeteer import launch
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://localhost:5000"
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SPOTIFY_USERNAME = os.getenv("SPOTIFY_USERNAME")
SPOTIFY_PASSWORD = os.getenv("SPOTIFY_PASSWORD")
SPOTIFY_API_URL = "https://api.spotify.com/v1"

@pytest.fixture(scope="session")
def session_with_tokens():
    """Logs in the user and retrieves JWT, Spotify access token, and refresh token."""
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

    json_response = response.json()
    access_token = json_response.get("accessToken")
    refresh_token = json_response.get("refreshToken")
    assert access_token, "Spotify access token not found in response"
    assert refresh_token, "Spotify refresh token not found in response"

    return {
        "session": session,
        "jwt_token": jwt_cookie,
        "access_token": access_token,
        "refresh_token": refresh_token
    }

async def get_spotify_auth_code():
    """Launch Puppeteer to automate Spotify login and fetch the authorization code."""
    browser = await launch(
        headless=True, 
        executablePath="C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",  # Adjust path if needed
        args=["--no-sandbox"]
    )
    page = await browser.newPage()

    auth_url = (
        f"{SPOTIFY_AUTH_URL}?client_id={CLIENT_ID}"
        f"&response_type=code&redirect_uri={REDIRECT_URI}"
        f"&scope=user-read-playback-state"
    )

    try:
        print("Navigating to Spotify login...")
        await page.goto(auth_url, {"waitUntil": "networkidle2"})

        print("Filling in login details...")
        await page.type("input#login-username", SPOTIFY_USERNAME)
        await page.type("input#login-password", SPOTIFY_PASSWORD)
        await page.click("button#login-button")

        await page.waitForNavigation({"waitUntil": "networkidle2"})

        auth_button = await page.querySelector("button[data-testid='auth-accept']")
        if auth_button:
            print("Clicking 'Authorize' button...")
            await auth_button.click()
            await page.waitForNavigation({"waitUntil": "networkidle2"})

        redirected_url = page.url
        print(f"Redirected URL: {redirected_url}")

        if "code=" not in redirected_url:
            raise Exception("Authorization code not found in the URL.")

        auth_code = redirected_url.split("code=")[1].split("&")[0]
        print(f"Retrieved Spotify Authorization Code: {auth_code}")

        return auth_code
    except Exception as e:
        print(f"Error retrieving Spotify auth code: {e}")
        return None
    finally:
        await browser.close()

@pytest.mark.asyncio
async def test_exchange_spotify_token():
    """Tests exchanging an authorization code for access & refresh tokens."""
    auth_code = await get_spotify_auth_code()
    
    url = f"{BASE_URL}/api/spotify/exchange-token"
    response = requests.post(url, json={"code": auth_code})

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"

    json_response = response.json()
    assert "access_token" in json_response, "Access token not found in response"
    assert "refresh_token" in json_response, "Refresh token not found in response"

def test_fetch_spotify_data(session_with_tokens):
    """Tests fetching Spotify user data."""
    jwt_token = session_with_tokens["jwt_token"]

    headers = {
        "Cookie": f"jwt={jwt_token}"
    }

    data_url = f"{BASE_URL}/api/refresh"
    response = requests.post(data_url, headers=headers)

    assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
    assert "id" in response.json(), "User ID not found in response"
    assert "display_name" in response.json(), "User display name not found"

def test_get_available_devices(session_with_tokens):
    """Tests fetching available Spotify devices."""
    access_token = session_with_tokens["access_token"]

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    devices_url = "https://api.spotify.com/v1/me/player/devices"
    response = requests.get(devices_url, headers=headers)

    assert response.status_code in [200, 204], f"Expected 200 or 204 but got {response.status_code}"

    if response.status_code == 200:
        assert "devices" in response.json(), "Devices not found in response"
