import React, { useEffect, useState } from "react";
import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedArtistsProps {
    artistId: string;
    artistName: string;
    accessToken: string;
    currentlyPlaying: string | null;
    handlePlayPause: (uri: string | null, isAlbum: boolean) => void;
}

const RelatedArtists: React.FC<RelatedArtistsProps> = ({
    artistId,
    artistName,
    accessToken,
    currentlyPlaying,
    handlePlayPause,
}) => {
    interface Artist {
        id: string;
        name: string;
        images: { url: string }[];
        uri: string;
    }

    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const artistsPerView = 5;
    const slideWidth = 150 + 24;

    useEffect(() => {
        const fetchRelatedArtists = async () => {
            try {
                const relatedResponse = await fetch(
                    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!relatedResponse.ok) {
                    console.error("Related artists endpoint failed. Falling back to Search API.");
                    throw new Error("Related artists not found");
                }

                const relatedData = await relatedResponse.json();
                setArtists(relatedData.artists);
            } catch {
                try {
                    const searchResponse = await fetch(
                        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                            artistName
                        )}&type=artist&limit=10`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    if (!searchResponse.ok) throw new Error("Search API failed");

                    const searchData = await searchResponse.json();
                    setArtists(searchData.artists.items);
                } catch (err) {
                    setError((err as Error).message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedArtists();
    }, [artistId, artistName, accessToken]);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - artistsPerView, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + artistsPerView, artists.length - artistsPerView)
        );
    };

    if (loading) return <p className="text-white">Loading related artists...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!artists.length) return <p className="text-white">No related artists found.</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Artists</h2>
            <div className="relative">
                {/* Left Button */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 rounded-full transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 shadow hover:bg-gray-700"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Carousel Container */}
                <div
                    className="overflow-hidden relative"
                    style={{ height: "220px" }}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * slideWidth}px)`,
                        }}
                    >
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                className="flex-none w-[150px] cursor-pointer"
                                onClick={() => navigate(`/artist/${artist.id}`)}
                            >
                                <div className="relative group rounded hover:bg-backgroundElevatedHighlight transition p-2">
                                    <div className="w-full h-[150px] bg-gray-800 rounded-full overflow-hidden shadow-md transition">
                                        <img
                                            src={artist.images?.[0]?.url || "/placeholder.jpg"}
                                            alt={artist.name || "Artist"}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play/Pause Button */}
                                        <div
                                            className="absolute mt-6 right-2 bottom-14 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlayPause(artist.uri, false);
                                            }}
                                        >
                                            {currentlyPlaying === artist.uri ? (
                                                <IoIosPause className="text-xl" />
                                            ) : (
                                                <FaPlay className="text-xl" />
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-white mt-2 truncate">
                                        {artist.name || "Unknown Artist"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">Artist</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Button */}
                {currentIndex + artistsPerView < artists.length && (
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow hover:bg-gray-700"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default RelatedArtists;
