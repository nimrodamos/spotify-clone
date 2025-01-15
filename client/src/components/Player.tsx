import { assets, songsData } from "../assets/assets";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAppData } from "@/Context/AppDataContext";

function Player() {
  const { user } = useUserContext(); // Access UserContext
  const navigate = useNavigate();
  const { toggleRsb, setRsbMode } = useAppData();

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
            <span className="ButtonInner-sc-14ud5tc-0 kwEVAz encore-inverted-light-set XkXPpDRWozMF6G8_GlLQ">
              Sign up free
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className=" bg-black flex justify-between items-center text-white px-4">
        <div className="hidden lg:flex items-center gap-4">
          <img className="w-12" src={songsData[0].image} alt="" />
          <div>
            <p>{songsData[0].name}</p>
            <p>{songsData[0].desc.slice(0, 12)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 m-auto">
          <div className="flex gap-4">
            <img
              className="w-4 cursor-pointer"
              src={assets.shuffle_icon}
              alt=""
            />
            <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
            <img className="w-4 cursor-pointer" src={assets.play_icon} alt="" />
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
          <div className="w-20 bg-slate-50 h-1 rounder"></div>
          <img className="w-4" src={assets.mini_player_icon} alt="" />
          <img className="w-4" src={assets.zoom_icon} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Player;
