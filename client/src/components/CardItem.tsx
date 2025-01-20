import { IoIosPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CardItemProps {
  image: string;
  name: string;
  desc: string;
  id: string; // Spotify Album ID
  type: "album" | "artist" | "playlist" | "track";
  currentlyPlaying: string;
  accessToken: string; // Pass the user's Spotify access token
  handlePlayPause: (id: string) => void; // Updated to handle play/pause logic
}

const CardItem: React.FC<CardItemProps> = ({
  image,
  name,
  desc,
  id,
  type,
  currentlyPlaying,
  accessToken,
  handlePlayPause,
}) => {
  const navigate = useNavigate();

  const playAlbum = async (albumId: string) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        {
          context_uri: `spotify:album:${albumId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error playing album:", error);
    }
  };

  const pausePlayback = async () => {
    try {
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
    } catch (error) {
      console.error("Error pausing playback:", error);
    }
  };

  const handlePlayPauseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (currentlyPlaying === id) {
      pausePlayback();
    } else {
      playAlbum(id);
    }
    handlePlayPause(id);
  };

  const handleClick = () => {
    if (type === "album") navigate(`/album/${id}`);
    else if (type === "artist") navigate(`/artist/${id}`);
    else if (type === "playlist") navigate(`/playlist/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative min-w-[180px] max-h-[300px] p-2 px-3 rounded cursor-pointer group hover:bg-[#ffffff26] transition-all duration-300"
    >
      <div className="relative">
        <img
          className="w-[180px] aspect-square object-cover rounded"
          src={image}
          alt={name}
        />
        <div className="absolute bottom-1 right-2 opacity-0 translate-y-6 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
          <div
            className="absolute mt-6 right-1 bottom-2 bg-green-500 text-black rounded-full p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={handlePlayPauseClick}
          >
            {currentlyPlaying === id ? (
              <IoIosPause className="text-xl" />
            ) : (
              <FaPlay className="text-xl" />
            )}
          </div>
        </div>
      </div>

      <p className="font-bold mt-2 mb-1 text-white">{name}</p>
      <p className="text-sm text-textSubdued">{desc}</p>
    </div>
  );
};

export default CardItem;
