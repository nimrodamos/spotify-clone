import axios from "axios";
import dotenv from "dotenv";
import { Track } from "../models/trackModel.js";

dotenv.config();

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

async function fetchAppAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching app-level access token:", error.message);
    throw new Error("Failed to fetch app-level access token.");
  }
}

// Function to fetch artist details
const fetchArtistDetails = async (req, res) => {
  try {
    const { artistId } = req.params;
    const accessToken = await fetchAppAccessToken();

    const spotifyApiUrl = `${SPOTIFY_API_URL}/artists/${artistId}`;
    const spotifyResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const artistDetails = spotifyResponse.data;
    const { name, genres, images, followers, popularity } = artistDetails;
    const artistImage = images[0]?.url;

    res
      .status(200)
      .json({
        name,
        genres,
        artistImage,
        followers: followers.total,
        popularity,
      });
  } catch (err) {
    console.error("Error in fetchArtistDetails:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const fetchTracks = async (req, res) => {
  try {
    const { trackIds } = req.body; // Expecting an array of track IDs
    const accessToken = await fetchAppAccessToken();

    const tracks = [];
    for (const trackId of trackIds) {
      const existingTrack = await Track.findOne({ spotifyTrackId: trackId });
      if (existingTrack) {
        console.log(`Track with ID ${trackId} already exists in the database.`);
        continue;
      }

      const spotifyApiUrl = `${SPOTIFY_API_URL}/tracks/${trackId}`;
      const spotifyResponse = await axios.get(spotifyApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const trackDetails = spotifyResponse.data;
      const {
        name: title,
        artists,
        album,
        duration_ms,
        id: spotifyTrackId,
      } = trackDetails;
      const artist = artists.map((a) => a.name).join(", ");
      const albumName = album.name;
      const albumCover = album.images[0]?.url;
      const duration = duration_ms;

      const newTrack = new Track({
        spotifyTrackId,
        name: title,
        artist,
        album: albumName,
        albumCoverUrl: albumCover,
        durationMs: duration,
      });

      await newTrack.save();
      tracks.push(newTrack);
    }

    res.status(200).json(tracks);
  } catch (err) {
    console.error("Error in fetchTracks:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const fetchTrackDetails = async (req, res) => {
  try {
    const { trackId } = req.params;
    const accessToken = await fetchAppAccessToken();

    const spotifyApiUrl = `${SPOTIFY_API_URL}/tracks/${trackId}`;
    const spotifyResponse = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const trackDetails = spotifyResponse.data;
    const {
      name: title,
      artists,
      album,
      duration_ms,
      id: spotifyTrackId,
    } = trackDetails;
    const artist = artists.map((a) => a.name).join(", ");
    const albumName = album.name;
    const albumCover = album.images[0]?.url;
    const duration = duration_ms;

    const newTrack = new Track({
      spotifyTrackId,
      name: title,
      artist,
      album: albumName,
      albumCoverUrl: albumCover,
      durationMs: duration,
    });

    await newTrack.save();

    res
      .status(200)
      .json({ spotifyTrackId, title, artist, albumName, albumCover, duration });
  } catch (err) {
    console.error("Error in fetchTrackDetails:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export { fetchTrackDetails, fetchArtistDetails, fetchTracks };
export default fetchAppAccessToken;
