import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/Context/UserContext.tsx";
import FilterButtons from "./FilterButtons";
import TopResult from "./TopResult";
import SongsSection from "./SongSection";
import MoreFrom from "./MoreFrom";
import RelatedArtists from "./RelatedArtists";
import Albums from "./Albums";
import { FooterSection } from "../Profile/sections/FooterSection";

const SearchResults: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { results } = location.state || {};

    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState("All");

    if (!results) {
        return <p className="text-white">No search results available. Try searching again.</p>;
    }

    const { tracks, artists } = results;

    const filteredTracks =
        currentFilter === "All" || currentFilter === "Songs" ? tracks?.items || [] : [];
    const filteredArtists =
        currentFilter === "All" || currentFilter === "Artists" ? artists?.items || [] : [];

    const extractArtistId = (spotifyUrl: string) => {
        const parts = spotifyUrl.split("/");
        return parts[parts.length - 1];
    };

    const handleArtistClick = (spotifyUrl: string) => {
        const artistId = extractArtistId(spotifyUrl);
        navigate(`/artist/${artistId}`);
    };

    const handlePlayPause = async (uri: string | null, isAlbum: boolean = false) => {
        if (!user || !user.accessToken) {
            console.error("User not authenticated");
            return;
        }
    
        if (!uri) {
            console.error("Invalid Spotify URI");
            return;
        }
    
        try {
            if (currentlyPlaying === uri) {
                await fetch("https://api.spotify.com/v1/me/player/pause", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                });
                setCurrentlyPlaying(null);
            } else {
                const body = isAlbum
                    ? { context_uri: uri }
                    : { uris: [uri] };
    
                await fetch("https://api.spotify.com/v1/me/player/play", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                setCurrentlyPlaying(uri);
            }
        } catch (error) {
            console.error("Error controlling playback:", error);
        }
    };

    return (
        <div className="p-6 text-white bg-backgroundBase">
            <div className="sticky top-0 p-1 z-50 bg-backgroundBase">
            <FilterButtons currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredArtists?.length > 0 && (
                <TopResult
                artist={filteredArtists[0]}
                currentlyPlaying={currentlyPlaying}
                handlePlayPause={handlePlayPause}
                handleArtistClick={handleArtistClick}
                />
            )}
            {filteredTracks?.length > 0 && (
                <SongsSection
                tracks={filteredTracks}
                currentlyPlaying={currentlyPlaying}
                handlePlayPause={handlePlayPause}
                />
            )}
            </div>
            <MoreFrom
            artistId={filteredArtists[0].id}
            artistName={filteredArtists[0].name}
            accessToken={user?.accessToken || ""}
            currentlyPlaying={currentlyPlaying}
            handlePlayPause={handlePlayPause}
            />
            <RelatedArtists
                artistId={filteredArtists[0].id}
                artistName={filteredArtists[0].name}
                accessToken={user?.accessToken || ""}
                currentlyPlaying={currentlyPlaying}
                handlePlayPause={handlePlayPause}
            />
            <Albums
                artistId={filteredArtists[0].id}
                artistName={filteredArtists[0].name}
                accessToken={user?.accessToken || ""}
                currentlyPlaying={currentlyPlaying}
                handlePlayPause={handlePlayPause}
            />
            <FooterSection />
        </div>
    );
};

export default SearchResults;
