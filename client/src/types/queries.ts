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
  const response = await api.get("/api/artists");
  return response.data;
};

export const fetchTracks = async () => {
  const response = await api.get("/api/tracks");
  return response.data;
};