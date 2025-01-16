import axios from "axios";
import User from "../models/userModel.js";
import puppeteer from 'puppeteer';

const getSpotifyAuthorizationCode = async () => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize`;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;
    const scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private";

    if (!redirectUri) {
        throw new Error("REDIRECT_URI is not defined in the environment variables.");
    }

    const loginUrl = `${spotifyAuthUrl}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    console.log("Spotify Login URL:", loginUrl);

    const spotifyUsername = process.env.SPOTIFY_USERNAME;
    const spotifyPassword = process.env.SPOTIFY_PASSWORD;

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
        console.log("Navigating to Spotify login page...");
        await page.goto(loginUrl, { waitUntil: "networkidle2" });

        console.log("Filling in login credentials...");
        await page.waitForSelector('input#login-username', { timeout: 10000 });
        await page.type('input#login-username', spotifyUsername, { delay: 50 });
        await page.type('input#login-password', spotifyPassword, { delay: 50 });
        await page.click('button#login-button');

        console.log("Waiting for navigation...");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        const authorizeButton = await page.$('button[data-testid="auth-accept"]');
        if (authorizeButton) {
            console.log("Clicking authorize button...");
            await authorizeButton.click();
            await page.waitForNavigation({ waitUntil: "networkidle2" });
        }

        const redirectedUrl = page.url();
        console.log("Redirected URL after authorization:", redirectedUrl);

        const urlParams = new URLSearchParams(new URL(redirectedUrl).search);
        const authorizationCode = urlParams.get("code");

        console.log("Authorization Code:", authorizationCode);

        if (!authorizationCode) {
            throw new Error("Authorization code not found in URL.");
        }

        await browser.close();
        return authorizationCode;
    } catch (error) {
        console.error("Error in getSpotifyAuthorizationCode:", error.message);
        await browser.close();
        throw new Error("Failed to fetch Spotify authorization code");
    }
};

const getAvailableDevices = async (accessToken) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/me/player/devices", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("Available Devices:", response.data.devices);
        return response.data.devices;
    } catch (error) {
        console.error("Error fetching available devices:", error.response?.data || error.message);
        throw new Error("Failed to fetch available devices");
    }
};

const activateDevice = async (accessToken, deviceId) => {
    try {
        const response = await axios.put(
            "https://api.spotify.com/v1/me/player",
            {
                device_ids: [deviceId],
                play: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Playback transferred successfully");
        return response.data;
    } catch (error) {
        console.error("Error transferring playback:", error.response?.data || error.message);
        throw new Error("Failed to activate the device");
    }
};

const exchangeAuthorizationCodeForTokens = async (authorizationCode) => {
    try {
        const redirectUri = process.env.REDIRECT_URI;
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!authorizationCode || !redirectUri || !clientId || !clientSecret) {
            throw new Error("Missing required environment variables or authorization code");
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: authorizationCode,
                redirect_uri: redirectUri,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("Token exchange response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error exchanging authorization code for tokens:", error.response?.data || error.message);
        throw new Error("Failed to exchange Spotify authorization code for tokens");
    }
};

const getCurrentUserProfile = async (accessToken) => {
    try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("User Profile:", response.data);
        return response.data.product;
    } catch (error) {
        console.error("Error fetching user profile:", error.response?.data || error.message);
        throw new Error("Failed to fetch user profile");
    }
};

const getSpotifyAccessToken = async (user) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        if (!user.accessToken || user.expiresIn < currentTime) {
            console.log('Access token expired. Attempting to refresh...');
            const newAccessToken = await refreshSpotifyToken(user.refreshToken);

            user.accessToken = newAccessToken;
            user.expiresIn = currentTime + 3600;
            await user.save();

            console.log('Access token refreshed successfully:', newAccessToken);
            return newAccessToken;
        }

        console.log('Access token is still valid:', user.accessToken);
        return user.accessToken;
    } catch (error) {
        console.error('Error in getSpotifyAccessToken:', error.message, error.stack);
        throw new Error('Failed to refresh or fetch Spotify access token');
    }
};

const fetchSpotifyAccessToken = async () => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'client_credentials',
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString('base64')}`,
            }
        });

        console.log("Spotify token fetched:", response.data);
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        throw new Error('Failed to fetch Spotify access token');
    }
};

const refreshSpotifyToken = async (refreshToken) => {
    try {
        console.log('Refreshing token with refreshToken:', refreshToken);
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log('New token fetched:', response.data);
        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        throw new Error('Failed to refresh Spotify token');
    }
};

const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const accessToken = await getSpotifyAccessToken(user);
        req.spotifyAccessToken = accessToken;
        next();
    } catch (error) {
        res.status(500).json({ error: "Failed to refresh token or get valid access token" });
    }
};

const fetchSpotifyData = async (req, res) => {
    try {
        const { spotifyAccessToken } = req;

        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${spotifyAccessToken}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching Spotify data:", error.message);
        res.status(500).json({ error: "Failed to fetch Spotify data" });
    }
};

const exchangeAuthorizationCode = async (user, code) => {
    const redirectUri = process.env.REDIRECT_URI;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }).toString(), {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token, refresh_token, expires_in } = response.data;
        user.accessToken = access_token;
        user.refreshToken = refresh_token;
        user.expiresIn = Math.floor(Date.now() / 1000) + expires_in;
        await user.save();

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);
        console.log('Expires In:', expires_in);

        return { access_token, refresh_token, expires_in };
    } catch (error) {
        console.error('Error exchanging authorization code:', error.response?.data || error.message);
        throw new Error('Failed to exchange authorization code');
    }
};

export { getSpotifyAccessToken, activateDevice, getAvailableDevices, getCurrentUserProfile, refreshSpotifyToken, refreshTokenMiddleware, fetchSpotifyData, exchangeAuthorizationCode, getSpotifyAuthorizationCode, exchangeAuthorizationCodeForTokens };
