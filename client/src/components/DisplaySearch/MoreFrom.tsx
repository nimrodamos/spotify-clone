import React, { useEffect, useState } from "react";
import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MoreFromProps {
    artistId: string;
    artistName: string;
    accessToken: string;
    currentlyPlaying: string | null;
    handlePlayPause: (uri: string | null, isAlbum: boolean) => void;
}

const MoreFrom: React.FC<MoreFromProps> = ({
    artistId,
    artistName,
    accessToken,
    currentlyPlaying,
    handlePlayPause,
}) => {
    interface Album {
        id: string;
        name: string;
        images: { url: string }[];
        uri: string;
    }

    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const albumsPerView = 5;
    const slideWidth = 150 + 24;

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await fetch(
                    `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=10`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Failed to fetch albums");
                const data = await response.json();
                setAlbums(data.items);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [artistId, accessToken]);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - albumsPerView, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + albumsPerView, albums.length - albumsPerView)
        );
    };

    if (loading) return <p className="text-white">Loading albums...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!albums.length) return <p className="text-white">No albums found.</p>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Featuring {artistName}</h2>
            <div className="relative">
                {/* Left Button */}
                {currentIndex > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white rounded-full p-2 shadow hover:bg-gray-700"
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
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="flex-none w-[150px] cursor-pointer"
                                onClick={() => navigate(`/album/${album.id}`)}
                            >
                                <div className="relative group rounded hover:bg-backgroundElevatedHighlight transition p-2">
                                    <div className="w-full h-[150px] bg-gray-800 rounded overflow-hidden shadow-md transition">
                                        <img
                                            src={album.images?.[0]?.url || "/placeholder.jpg"}
                                            alt={album.name || "Album"}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Play/Pause Button */}
                                        <div
                                            className="absolute mt-6 right-2 bottom-14 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlayPause(album.uri, true);
                                            }}
                                        >
                                            {currentlyPlaying === album.uri ? (
                                                <IoIosPause className="text-xl" />
                                            ) : (
                                                <FaPlay className="text-xl" />
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-white mt-2 truncate">
                                        {album.name || "Unknown Album"}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">By Spotify</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Button */}
                {currentIndex + albumsPerView < albums.length && (
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

export default MoreFrom;
