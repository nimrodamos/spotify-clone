import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDb.js';
import userRoutes from './routes/userRoute.js';
import PlaylistRoutes from './routes/playlistRoute.js';
import apiCallsRoutes from './routes/apiCallsRoute.js';
import dbAlbumRoutes from './routes/dbAlbumRoute.js';
import dbTrackRoutes from './routes/dbTrackRoute.js';
import dbArtistRoutes from './routes/dbartistRoute.js';
import path from 'path';
import cloudinary from 'cloudinary';
import User from './models/userModel.js';
import jwt from 'jsonwebtoken';
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const frontendPath = path.join(__dirname, "../../frontend/dist");
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(frontendPath));
app.use(cors({
    origin: 'http://localhost:5173', // Replace with the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  }));
app.use('/api/users', userRoutes);
app.use('/api/playlists', PlaylistRoutes);
app.use('/api/albums', dbAlbumRoutes);
app.use('/api/tracks', dbTrackRoutes);
app.use('/api/artists', dbArtistRoutes);
app.use('/api/', apiCallsRoutes);

app.use('/spotify/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('No authorization code provided');
    }

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code, 
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        const token = req.cookies.token || (req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null);

        if (!token) {
            return res.status(401).send('Authentication token is missing');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).send('Invalid or expired authentication token');
        }

        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.accessToken = access_token;
        user.refreshToken = refresh_token;
        user.tokenExpiresIn = Date.now() + expires_in * 1000;
        await user.save();

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);
        console.log('Expires In:', expires_in);

        res.status(200).send('Tokens saved successfully');
    } catch (error) {
        console.error('Error during Spotify callback:', error);
        res.status(500).send('Failed to handle Spotify callback');
    }
});

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, expires_in } = response.data;
        console.log('New Access Token:', access_token);
        return access_token;
    } catch (error) {
        console.error('Error refreshing token', error);
        throw new Error('Unable to refresh token');
    }
};

app.get('/spotify/profile', async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        const storedRefreshToken = user.refreshToken;
        let accessToken = user.accessToken;

        if (isAccessTokenExpired(accessToken)) {
            accessToken = await refreshAccessToken(storedRefreshToken);
        }

        res.json(userProfile.data);
    } catch (error) {
        console.error('Error fetching user profile from Spotify:', error);
        res.status(500).send('Failed to fetch profile');
    }
});

const isAccessTokenExpired = (accessToken) => {
    const decodedToken = decodeJwtToken(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

const decodeJwtToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default refreshAccessToken;