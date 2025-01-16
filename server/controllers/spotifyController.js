import axios from "axios";
import User from "../models/userModel.js"; // Adjust the path as necessary
import puppeteer from 'puppeteer';

const getSpotifyAuthorizationCode = async () => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize`;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;
    const scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing";

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
        headless: true, // Run in headless mode to avoid opening the browser
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    try {
        console.log("Navigating to Spotify login page...");
        await page.goto(loginUrl, { waitUntil: "networkidle2" });

        // Login to Spotify
        console.log("Filling in login credentials...");
        await page.waitForSelector('input#login-username', { timeout: 10000 });
        await page.type('input#login-username', spotifyUsername, { delay: 50 });
        await page.type('input#login-password', spotifyPassword, { delay: 50 });
        await page.click('button#login-button');

        // Wait for navigation or redirection
        console.log("Waiting for navigation...");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        // Handle authorization consent page
        const authorizeButton = await page.$('button[data-testid="auth-accept"]');
        if (authorizeButton) {
            console.log("Clicking authorize button...");
            await authorizeButton.click();
            await page.waitForNavigation({ waitUntil: "networkidle2" });
        }

        // Capture redirected URL
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


// Step 2: Exchange Authorization Code for Tokens
const exchangeAuthorizationCodeForTokens = async (code) => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET,
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;
        console.log('Tokens:', { access_token, refresh_token, expires_in });

        return { access_token, refresh_token, expires_in };
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error.message);
        throw new Error('Failed to exchange Spotify authorization code for tokens');
    }
};

// Fetch access token if expired
const getSpotifyAccessToken = async (user) => {
    try {
        const currentTime = Math.floor(Date.now() / 1000);
        if (!user.accessToken || user.expiresIn < currentTime) {
            console.log('Access token expired. Attempting to refresh...');
            const newAccessToken = await refreshSpotifyToken(user.refreshToken);

            user.accessToken = newAccessToken;
            user.expiresIn = currentTime + 3600; // Set to 1 hour from now
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

// Function to fetch a new Spotify access token (client credentials flow)
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

        console.log("Spotify token fetched:", response.data);  // Add logging
        return response.data.access_token;  // Return the new access token
    } catch (error) {
        console.error("Error fetching token:", error.response?.data || error.message);
        throw new Error('Failed to fetch Spotify access token');
    }
};

// Function to refresh the access token using the refresh token
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

export { getSpotifyAccessToken, refreshSpotifyToken, refreshTokenMiddleware, fetchSpotifyData, exchangeAuthorizationCode, getSpotifyAuthorizationCode, exchangeAuthorizationCodeForTokens };