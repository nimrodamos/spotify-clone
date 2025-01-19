import axios from "axios";
import {
  getSpotifyAccessToken,
  getAvailableDevices,
} from "./spotifyController.js";

const playTrack = async (req, res) => {
  try {
    const { spotifyTrackId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    const devices = await getAvailableDevices(accessToken);
    if (devices.length === 0) {
      return res.status(404).json({
        error:
          "No Spotify devices found. Please open Spotify on a device and try again.",
      });
    }

    const targetDevice = devices[0];

    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${targetDevice.id}`,
      { uris: [`spotify:track:${spotifyTrackId}`] },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Track is now playing." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const pauseTrack = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.put(
      "https://api.spotify.com/v1/me/player/pause",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Playback paused." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const nextTrack = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.post(
      "https://api.spotify.com/v1/me/player/next",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Skipped to the next track." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
const resumeTrack = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Playback resumed." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const previousTrack = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.post(
      "https://api.spotify.com/v1/me/player/previous",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Rewound to the previous track." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const shuffleTracks = async (req, res) => {
  try {
    const { state } = req.body; // `state` should be `true` or `false`.
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.put(
      `https://api.spotify.com/v1/me/player/shuffle?state=${state}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: `Shuffle set to ${state}.` });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

const queueTrack = async (req, res) => {
  try {
    const { spotifyTrackId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const accessToken = await getSpotifyAccessToken(user);

    await axios.post(
      `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${spotifyTrackId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Track has been added to the queue." });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export {
  playTrack,
  pauseTrack,
  resumeTrack,
  nextTrack,
  previousTrack,
  shuffleTracks,
  queueTrack,
};
