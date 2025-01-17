import { useEffect, useState } from "react";
import axios from "axios";
import { assets, songsData } from "@/assets/assets"; // Adjusted alias import
import { useUserContext } from "@/Context/UserContext"; // Adjusted alias import
import { useNavigate } from "react-router-dom";
import { useAppData } from "@/Context/AppDataContext"; // Adjusted alias import

function Player() {
  const { user } = useUserContext(); // Access UserContext
  const navigate = useNavigate();
  const { toggleRsb } = useAppData();
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!user) {
      console.error("User not authenticated. Cannot initialize Spotify player.");
      return;
    }

    console.log("Initializing Spotify Web Playback SDK...");

    const loadSpotifySDK = () => {
      if (!window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          console.log("Spotify Web Playback SDK is ready!");

          const playerInstance = new Spotify.Player({
            name: "My Spotify App",
            getOAuthToken: (cb) => cb(user.accessToken),
            volume: 0.8,
          });

          playerInstance.addListener("ready", ({ device_id }) => {
            console.log("Player is ready with Device ID:", device_id);
            setIsReady(true);
            setActiveDevice(device_id);
          });

          playerInstance.addListener("not_ready", ({ device_id }) => {
            console.warn("Device ID has gone offline:", device_id);
          });

          playerInstance.addListener("authentication_error", ({ message }) => {
            console.error("Authentication Error:", message);
          });

          playerInstance.addListener("playback_error", ({ message }) => {
            console.error("Playback Error:", message);
          });

          playerInstance.connect().then((success) => {
            if (success) {
              console.log("Web Playback SDK connected successfully.");
            } else {
              console.error("Failed to connect the Web Playback SDK.");
            }
          });

          setPlayer(playerInstance);
        };
      }

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      script.onload = () => {
        console.log("Spotify SDK script loaded successfully.");
      };

      script.onerror = () => {
        console.error("Failed to load Spotify Web Playback SDK.");
      };

      document.body.appendChild(script);
    };

    loadSpotifySDK();

    return () => {
      if (player) {
        console.log("Disconnecting Spotify player...");
        player.disconnect();
        setPlayer(null);
      }
    };
  }, [user]);

  const setActiveDevice = async (deviceId: string) => {
    try {
      const response = await axios.put(
        "https://api.spotify.com/v1/me/player",
        { device_ids: [deviceId], play: true },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        console.log("Playback successfully transferred to the Web Playback SDK device.");
      } else {
        console.error("Failed to transfer playback:", response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error transferring playback:", error.response?.data || error.message);
      } else {
        console.error("Error transferring playback:", error);
      }
    }
  };

  // const playTrack = async () => {
  //   const testSongUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC"; // Test ID of a random Spotify song
  //   try {
  //     await axios.put(
  //       `https://api.spotify.com/v1/me/player/play`,
  //       {
  //         uris: [testSongUri],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user?.accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("Track started playing successfully.");
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Error starting track playback:", error.response?.data || error.message);
  //     } else {
  //       console.error("Error starting track playback:", error);
  //     }
  //   }
  // };

  if (!user) {
    return (
      <div className="bg-black mx-2">
        <div
          className="text-textBase bg-gradient-to-r from-[#af2896] to-[#509bf5] p-2 pl-4 flex w-full h-full flex-row items-center justify-between cursor-pointer gap-6 mt-[-0.25rem] relative z-10"
          data-testid="signup-bar"
        >
          <div className="flex flex-col">
            <p className="text-sm font-bold" data-encore-id="text">
              Preview of Spotify
            </p>
            <p className="text-base" data-encore-id="text">
              Sign up to get unlimited songs and podcasts with occasional ads.
              No credit card needed.
            </p>
          </div>
          <button
            data-encore-id="buttonPrimary"
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
    <div>
      <div className="bg-black flex justify-between items-center text-white px-4">
        <div className="hidden lg:flex items-center gap-4">
          <img className="w-12" src={songsData[0].image} alt="" />
          <div>
            <p>{songsData[0].name}</p>
            <p>{songsData[0].desc.slice(0, 12)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 m-auto">
          <div className="flex gap-4">
            <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
            <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
            <img
              className={`w-4 cursor-pointer ${!isReady ? "opacity-50" : ""}`}
              src={assets.play_icon}
              alt=""
              // onClick={playTrack}
            />
            <img className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
            <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
          </div>
          <div className="flex items-center gap-5">
            <p>1:06</p>
            <div className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
              <hr className="h-1 border-none w-0 bg-green-800 rounded-full" />
            </div>
            <p>3:20</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 opacity-75">
          <img
            className="w-4 cursor-pointer"
            src={assets.plays_icon}
            alt="song"
            onClick={() => toggleRsb("song")}
          />
          <img className="w-4" src={assets.mic_icon} alt="" />
          <img
            className="w-4 cursor-pointer"
            src={assets.queue_icon}
            alt="Queue"
            onClick={() => toggleRsb("queue")}
          />
          <img className="w-4" src={assets.speaker_icon} alt="" />
          <img className="w-4" src={assets.volume_icon} alt="" />
          <div className="w-20 bg-slate-50 h-1 rounded"></div>
          <img className="w-4" src={assets.mini_player_icon} alt="" />
          <img className="w-4" src={assets.zoom_icon} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Player;
