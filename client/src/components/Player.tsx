import { useEffect, useState } from "react";
import axios from "axios";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, VolumeX } from "lucide-react";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";

function Player() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { toggleRsb } = useAppData();

  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.5);

  const initializePlayer = (accessToken: string) => {
    const playerInstance = new Spotify.Player({
      name: "My Spotify App",
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    playerInstance.addListener("ready", ({ device_id }) => {
      setIsReady(true);
      setActiveDevice(device_id);
    });

    playerInstance.addListener("player_state_changed", (state) => {
      if (state) {
        setIsPlaying(!state.paused);
        setCurrentTrack(state.track_window.current_track);
        setProgressMs(state.position);
        setDurationMs(state.duration);
      }
    });

    playerInstance.connect();
    return playerInstance;
  };

  useEffect(() => {
    if (!user) {
      console.error("User not authenticated. Cannot initialize Spotify player.");
      return;
    }

    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = initializePlayer(user.accessToken);
        setPlayer(newPlayer);
      };

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [user]);

  const setActiveDevice = async (deviceId: string) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player",
        { device_ids: [deviceId], play: true },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error setting active device:", error);
    }
  };

  const togglePlayPause = () => {
    if (player) {
      isPlaying ? player.pause() : player.resume();
    }
  };

  const skipToNext = () => player?.nextTrack();
  const skipToPrevious = () => player?.previousTrack();

  const changeVolume = (value: number) => {
    if (player) {
      player.setVolume(value).then(() => setVolume(value));
      setIsMuted(value === 0);
    }
  };

  const muteUnmute = () => {
    if (isMuted) {
      changeVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      changeVolume(0);
      setIsMuted(true);
    }
  };

  const seekToPosition = (position: number) => {
    if (player) {
      player.seek(position).then(() => setProgressMs(position));
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && isPlaying) {
        setProgressMs((prev) => Math.min(prev + 1000, durationMs));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying, durationMs]);

  if (!user) {
    return (
      <div className="bg-black mx-2 mt-4">
        <div className="text-textBase bg-gradient-to-r from-[#af2896] to-[#509bf5] p-2 pl-4 flex w-full h-full flex-row items-center justify-between cursor-pointer gap-6 mt-[-0.25rem] relative z-10">
          <div className="flex flex-col">
            <p className="text-sm font-bold">Preview of Spotify</p>
            <p className="text-base">Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</p>
          </div>
          <button
            className="bg-textBase text-black p-4 mr-4 mt-2 rounded-3xl py-3 px-8 text-base font-bold"
            onClick={() => navigate("/signup")}
          >
            Sign up free
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white flex justify-between items-center px-4 py-3">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        {currentTrack?.album?.images?.[0]?.url && (
          <img
            className="w-14 h-14 object-cover"
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
          />
        )}
        <div>
          <p className="font-semibold text-sm">{currentTrack?.name || "No track playing"}</p>
          <p className="text-xs text-gray-400">
            {currentTrack?.artists?.map((artist: any) => artist.name).join(", ") || "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center justify-center gap-4">
          <Shuffle className="text-gray-400 hover:text-white hover:scale-[1.04] hover:fill-white  cursor-pointer" size={18} />
          <SkipBack className="text-gray-400 fill-gray-400 hover:text-white hover:fill-white hover:scale-[1.04] cursor-pointer" size={20} onClick={skipToPrevious} />
          <div
            onClick={togglePlayPause}
            className="bg-white text-black w-10 h-10 rounded-full hover:scale-[1.04] flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? <Pause size={20} className="fill-black  " /> : <Play className="fill-black " size={20} />}
          </div>
          <SkipForward className="text-gray-400 fill-gray-400 hover:scale-[1.04] hover:text-white hover:fill-white cursor-pointer" size={20} onClick={skipToNext} />
          <Repeat className="text-gray-400 hover:text-white cursor-pointer hover:scale-[1.04]" size={18} />
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs">{formatTime(progressMs)}</span>
          <input
            type="range"
            className="w-full h-[0.4rem] bg-gray-400  rounded-full accent-white hover:accent-green-500 cursor-pointer"
            min={0}
            max={durationMs}
            value={progressMs}
            onChange={(e) => seekToPosition(Number(e.target.value))}
          />
          <span className="text-xs">{formatTime(durationMs)}</span>
        </div>
      </div>

      {/* Right: Volume Control */}
      <div className="flex items-center justify-end gap-2 w-1/3">
        {isMuted ? (
          <VolumeX className="text-gray-400 hover:text-white cursor-pointer" size={20} onClick={muteUnmute} />
        ) : (
          <Volume2 className="text-gray-400 hover:text-white cursor-pointer" size={20} onClick={muteUnmute} />
        )}
        <input
          type="range"
          className="w-24 h-[0.2rem] bg-gray-400 rounded-full accent-white hover:accent-green-500 cursor-pointer"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Player;
