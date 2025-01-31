import { useEffect, useState } from "react";
import axios from "axios";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, LucideMonitorSpeaker } from "lucide-react";
import { useUserContext } from "@/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext";
import { TbMicrophone2, TbWindowMinimize } from "react-icons/tb";
import { RiRepeat2Fill, RiRepeatOneLine } from "react-icons/ri";
import { HiOutlineQueueList } from "react-icons/hi2";

function Player() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { toggleRsb } = useAppData();
  
  const [repeatState, setRepeatState] = useState<"off" | "context" | "track">("off");
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);
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
  }, [user, player]);

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

  const toggleShuffle = async () => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/shuffle",
        null,
        {
          params: { state: !isShuffling },
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsShuffling(!isShuffling);
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  };

  const toggleRepeat = async () => {
    try {
      const newRepeatState = repeatState === "off" ? "context" : repeatState === "context" ? "track" : "off";
      await axios.put(
        "https://api.spotify.com/v1/me/player/repeat",
        null,
        {
          params: { state: newRepeatState.toString() },
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setRepeatState(newRepeatState);
    } catch (error) {
      console.error("Error toggling repeat:", error);
    }
  };



  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.resume();
      }
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
            {currentTrack?.artists?.map((artist: {name: string}) => artist.name).join(", ") || "Unknown Artist"}
          </p>
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <Shuffle
              className={`text-gray-400 hover:text-white hover:scale-[1.04] cursor-pointer ${isShuffling ? "text-textPositive" : ""}`}
              size={18}
              onClick={toggleShuffle}
            />
            {isShuffling && (
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-textPositive rounded-full cursor-default"></div>
            )}
          </div>
          <SkipBack className="text-gray-400 fill-gray-400 hover:text-white hover:fill-white hover:scale-[1.04] cursor-pointer" size={20} onClick={skipToPrevious} />
          <div
            onClick={togglePlayPause}
            className="bg-white text-black w-10 h-10 rounded-full hover:scale-[1.04] flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? <Pause size={20} className="fill-black  " /> : <Play className="fill-black " size={20} />}
          </div>
          <SkipForward className="text-gray-400 fill-gray-400 hover:scale-[1.04] hover:text-white hover:fill-white cursor-pointer" size={20} onClick={skipToNext} />
          {repeatState === "track" ? (
            <div className="relative">
              <RiRepeatOneLine
          className="text-textPositive hover:text-white cursor-pointer hover:scale-[1.04]"
          size={20}
          onClick={toggleRepeat}
              />
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-textPositive rounded-full cursor-default"></div>
            </div>
          ) : repeatState === "context" ? (
            <div className="relative">
              <RiRepeat2Fill
          className="text-textPositive hover:text-white cursor-pointer hover:scale-[1.04]"
          size={20}
          onClick={toggleRepeat}
              />
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-textPositive rounded-full cursor-default"></div>
            </div>
          ) : (
            <RiRepeat2Fill
              className="text-gray-400 hover:text-white cursor-pointer hover:scale-[1.04]"
              size={20}
              onClick={toggleRepeat}
            />
          )}
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
      <div className="flex items-center justify-end gap-2 w-1/3 cursor-pointer ">
        <div className="relative">
          <TbMicrophone2 
        className={`text-gray-400 hover:text-white hover:scale-[1.04] ${window.location.pathname === "/lyrics" ? "text-textPositive hover:text-textPositive hover:scale-[1.04]" : ""}`}
        size={20}
        onClick={() => {
          if (window.location.pathname === "/lyrics") {
            navigate(-1);
          } else {
            navigate("/lyrics");
          }
        }}
          />
          {window.location.pathname === "/lyrics" && (
        <div className="absolute bottom-[-8px] left-2 transform -translate-x-1/2 w-1 h-1 bg-textPositive rounded-full cursor-default"></div>
          )}
        </div>
        <LucideMonitorSpeaker className="text-gray-400 hover:text-white hover:scale-[1.04]" size={20} />
        <HiOutlineQueueList className="text-gray-400 hover:text-white hover:scale-[1.04]" size={20} />
        {isMuted ? (
          <VolumeX className="text-gray-400 hover:text-white hover:scale-[1.04]" size={20} onClick={muteUnmute} />
        ) : (
          <Volume2 className="text-gray-400 hover:text-white hover:scale-[1.04]" size={20} onClick={muteUnmute} />
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
        <TbWindowMinimize className="-rotate-90 text-gray-400 hover:text-white hover:scale-[1.04]" size={20} />
      </div>
    </div>
  );
}

export default Player;
