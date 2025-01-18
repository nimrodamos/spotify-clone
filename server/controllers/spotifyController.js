import axios from "axios";
import User from "../models/userModel.js";
import puppeteer from "puppeteer";
import jwt from "jsonwebtoken";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

/**
 * Get Spotify Authorization Code using Puppeteer.
 */
const getSpotifyAuthorizationCode = async () => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize`;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;
    const SCOPES = [
        "user-read-recently-played",
        "user-read-playback-position",
        "user-top-read",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "app-remote-control",
        "streaming",
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "user-library-modify",
        "user-library-read",
        "user-read-email",
        "user-read-private",
        "user-follow-read",
        "user-follow-modify",
        "ugc-image-upload",
    ];

    if (!redirectUri) {
        throw new Error("REDIRECT_URI is not defined in the environment variables.");
    }

    const loginUrl = `${spotifyAuthUrl}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

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
        await page.waitForSelector("input#login-username", { timeout: 10000 });
        await page.type("input#login-username", spotifyUsername, { delay: 50 });
        await page.type("input#login-password", spotifyPassword, { delay: 50 });
        await page.click("button#login-button");

        console.log("Waiting for navigation...");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        const authorizeButton = await page.$("button[data-testid='auth-accept']");
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


const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the Bearer token
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }
    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    console.error("Error in authenticateUser middleware:", error.message);
    res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};

export default authenticateUser;


/**
 * Refresh Spotify access token using the refresh token.
 */
const refreshSpotifyToken = async (refreshToken) => {
    try {
        console.log("Refreshing token with refreshToken...");
        const response = await axios.post(SPOTIFY_AUTH_URL, new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }).toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        console.log("New token fetched:", response.data);
        return {
            accessToken: response.data.access_token,
            expiresIn: Math.floor(Date.now() / 1000) + response.data.expires_in,
        };
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        throw new Error("Failed to refresh Spotify token");
    }
};

/**
 * Middleware to ensure valid Spotify access token.
 */
const refreshTokenMiddleware = async (req, res, next) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ error: "User not authenticated." });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (user.expiresIn < currentTime) {
            console.log("Token expired, refreshing...");
            const { accessToken, expiresIn } = await refreshSpotifyToken(user.refreshToken);

            user.accessToken = accessToken;
            user.expiresIn = expiresIn;
            await user.save();

            console.log("Token refreshed successfully.");
        }

        req.spotifyAccessToken = user.accessToken;
        next();
    } catch (error) {
        console.error("Error in refreshTokenMiddleware:", error.message);
        res.status(500).json({ error: "Failed to refresh token or get valid access token." });
    }
};

/**
 * Fetch Spotify API data using the access token.
 */
const getSpotifyAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (user.expiresIn < currentTime) {
            console.log("Token expired, refreshing...");
            const { accessToken, expiresIn } = await refreshSpotifyToken(user.refreshToken);

            user.accessToken = accessToken;
            user.expiresIn = expiresIn;
            await user.save();

            console.log("Token refreshed successfully.");
        }

        return user.accessToken;
    } catch (error) {
        console.error("Error getting Spotify access token:", error.message);
        throw new Error("Failed to get Spotify access token");
    }
};
/**
 * Get available devices from Spotify.
 */
const getAvailableDevices = async (accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/player/devices`, {
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

/**
 * Fetch Spotify API data using the access token.
 */
const fetchSpotifyData = async (req, res) => {
    try {
        const { spotifyAccessToken } = req;

        const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
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

/**
 * Activate a Spotify device.
 */
const activateDevice = async (accessToken, deviceId) => {
    try {
        const response = await axios.put(
            `${SPOTIFY_API_URL}/me/player`,
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

/**
 * Exchange authorization code for access and refresh tokens.
 */
const exchangeAuthorizationCode = async (authorizationCode) => {
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

export {
    getSpotifyAuthorizationCode,
    refreshSpotifyToken,
    refreshTokenMiddleware,
    getSpotifyAccessToken,
    getAvailableDevices,
    activateDevice,
    exchangeAuthorizationCode,
    fetchSpotifyData,
    authenticateUser,
};
