import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


const SearchResults: React.FC = () => {
    const location = useLocation();
    const { results } = location.state || {};

    if (!results) {
        return <p className="text-white">No search results available. Try searching again.</p>;
    }

    const { tracks, artists } = results;

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>

            {/* Display Artists */}
            {artists?.items?.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Top Artists</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {artists.items.map((artist) => (
                            <Link to={`/artist/${artist.id}`} key={artist.id}>
                                <div className="bg-backgroundElevatedBase rounded-lg p-3 hover:bg-backgroundElevatedHighlight transition">
                                    <img
                                        src={artist.images[0]?.url || "/placeholder.jpg"}
                                        alt={artist.name}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                    <p className="mt-2 text-center font-medium">{artist.name}</p>
                                    <p className="text-sm text-gray-400 text-center">
                                        {artist.followers.total.toLocaleString()} followers
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Display Tracks */}
            {tracks?.items?.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">Top Tracks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tracks.items.map((track) => (
                            <div
                                key={track.id}
                                className="bg-backgroundElevatedBase rounded-lg p-3 hover:bg-backgroundElevatedHighlight transition"
                            >
                                <img
                                    src={track.album.images[0]?.url || "/placeholder.jpg"}
                                    alt={track.name}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                                <div className="mt-2">
                                    <p className="font-medium">{track.name}</p>
                                    <p className="text-sm text-gray-400">
                                        {track.artists.map((artist) => artist.name).join(", ")}
                                    </p>
                                    <p className="text-sm text-gray-500">{track.album.name}</p>
                                    {track.preview_url && (
                                        <audio
                                            controls
                                            src={track.preview_url}
                                            className="w-full mt-2"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
