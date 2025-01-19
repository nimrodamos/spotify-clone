// queries.ts
import { api } from "../api.ts";

export const queryKeys = {
  artists: "artists",
  tracks: "tracks",
  topArtists: "topArtists",
  topTracks: "topTracks",
  followers: "followers",
  following: "following"
};

export const fetchArtists = async () => {
    try {
      const response = await api.get("/api/artists/offset?offset=0&limit=20", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}` // Or however you store the token
        }
      });
      console.log('Artists API Response:', response);
      return response.data;
    } catch (error) {
      console.error('Artists API Error:', error);
      throw error;
    }
  };

export const fetchTracks = async () => {
  try {
    // Check if this is the correct endpoint
    const response = await api.get("/api/tracks/offset?offset=0&limit=20");
    console.log('Tracks API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Tracks API Error:', error);
    throw error;
  }
};