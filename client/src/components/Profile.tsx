import React, { useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useAppData } from "../Context/AppDataContext"; // Assuming isRsbOpen comes from AppDataContext
import { IArtist, ITrack } from "@/types/types";
import { api } from "@/api";
import { PiDotsThree } from "react-icons/pi";

const Profile: React.FC = () => {
  const { user } = useUserContext();
  const { isRsbOpen } = useAppData(); // Access RSB state
  const [topArtists, setTopArtists] = useState<IArtist[]>([]);
  const [topTracks, setTopTracks] = useState<ITrack[]>([]);
  const [followers, setFollowers] = useState<IArtist[]>([]);
  const [following, setFollowing] = useState<IArtist[]>([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Adjusted width based on RSB state
  const profileWidth = isRsbOpen ? "77.1%" : "81.4%";

  // Adjusted display limit based on RSB state
  const displayLimit = isRsbOpen ? 6 : 8;

  useEffect(() => {
    if (!user) return;

    // Fetch random artists for Top Artists
    async function fetchTopArtists() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setTopArtists(artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit));
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    }

    // Fetch random tracks for Top Tracks
    async function fetchTopTracks() {
      try {
        const response = await api.get("/api/tracks");
        const tracks: ITrack[] = response.data;
        setTopTracks(tracks.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }

    // Use random artists for the Followers Section
    async function fetchFollowers() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setFollowers(artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit));
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    }

    // Use random artists for the Following Section
    async function fetchFollowing() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setFollowing(artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit));
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    }

    fetchTopArtists();
    fetchTopTracks();
    fetchFollowers();
    fetchFollowing();

    // Attach Scroll Listener
    const scrollableContainer = document.querySelector(".display-container");
    if (!scrollableContainer) {
      console.error("Scrollable container not found");
      return;
    }

    const handleScroll = () => {
      const scrollTop = (scrollableContainer as HTMLElement).scrollTop;
      setShowStickyHeader(scrollTop > 340);
    };

    scrollableContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollableContainer.removeEventListener("scroll", handleScroll);
    };
  }, [user, displayLimit]);

  if (!user) {
    return (
      <p className="text-center text-lg text-white">Please log in to view your profile.</p>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Sticky Header */}
      {showStickyHeader && (
        <div
          className="fixed top-[8.5%] left-[432px] h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-50 rounded-t"
          style={{ width: profileWidth, color: "#fff" }}
        >
          <h1 className="text-xl font-bold">{user.displayName}</h1>
        </div>
      )}

      {/* Profile Section */}
      <div className="relative bg-gradient-to-b from-[#B7DE72] to-black h-[572px] w-full">
        <div className="flex pt-[85px] space-x-6 p-6 w-full" style={{ maxWidth: profileWidth }}>
          <img
            src={user.profilePicture || "../../public/profilePic.jpeg"}
            alt={user.displayName}
            className="w-[235px] h-[235px] object-cover rounded-full shadow-lg"
          />
          <div>
            <p className="text-lg">Profile</p>
            <h1 className="text-[6rem] font-bold">{user.displayName}</h1>
            <p className="text-lg">8 Followers • 46 Following</p>
          </div>
        </div>
      </div>

      {/* Top Artists Section */}
      <div className="absolute top-[340px] left-0 bg-[#121212]/25 w-full" style={{ backdropFilter: "blur(4px)" }}>
        <div className="w-full pl-[37px]">
        <PiDotsThree className="text-4xl mt-[32px] mb-[23px]" />
          <h2 className="text-2xl font-bold text-white">Top artists this month</h2>
          <div className="flex">
            {topArtists.map((artist) => (
              <div
                key={artist._id}
                className="text-center hover:bg-[#1F1F1F] h-[235px] w-[180px] rounded px-2 py-2"
              >
                <img
                  src={artist.images?.[0]?.url || "https://via.placeholder.com/150"}
                  alt={artist.name}
                  className="w-[160px] h-[160px] object-cover rounded-full shadow-md"
                />
                <p className="text-sm mt-2 text-white text-left">{artist.name}</p>
                <p className="text-sm text-gray-400 text-left">Artist</p>
              </div>
            ))}
          </div>
        </div>
      </div>
{/* Top Tracks Section */}
<div
            className="absolute top-[764px] left-0 bg-[#121212] w-full "
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="w-full max-w pl-[37px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold  text-white">
                  Top tracks this month
                </h2>
                <a href="/top-tracks" className="text-sm text-gray-400 hover:text-white">
                  Show all
                </a>
              </div>
              <p className="text-sm text-gray-400 mb-4">Only visible to you</p>
              <ul>
                {topTracks.map((track, index) => (
                  <li
                    key={track._id}
                    className="flex justify-between items-center py-2 hover:bg-[#1F1F1F] px-4 rounded-md"
                  >
                    <div className="flex items-center">
                      <p className="text-sm text-gray-400 w-4">{index + 1}</p>
                      <img
                        src={track.albumCoverUrl || "https://via.placeholder.com/50"}
                        alt={track.name}
                        className="w-[40px] h-[40px] ml-4 object-cover rounded"
                      />
                      <div className="ml-4">
                        <p className="text-sm text-white">{track.name}</p>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{track.album}</p>
                    <p className="text-sm text-gray-400">
                      {(track.durationMs / 60000).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      
          {/* Followers Section */}
          <div
            className="absolute top-[1079px] left-0 bg-[#121212] w-full py-6"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="w-full max-w pl-[37px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Followers</h2>
                <a href="/followers" className="text-sm text-gray-400 hover:text-white">
                  Show all
                </a>
              </div>
              <div className="flex">
                {followers.map((artist) => (
                  <div
                    key={artist._id}
                    className="text-center hover:bg-[#1F1F1F] h-[235px] w-[180px] rounded px-2 py-2"
                  >
                    <img
                      src={artist.images?.[0]?.url || "https://via.placeholder.com/50"}
                      alt={artist.name}
                      className="w-[160px] h-[160px] object-cover rounded-full shadow-md"
                    />
                    <p className="text-sm mt-2 text-white text-left">{artist.name}</p>
                    <p className="text-sm text-gray-400 text-left">Profile</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      
          {/* Following Section */}
          <div
            className="absolute top-[1390px] left-0 bg-[#121212]/50 w-full py-6"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <div className="w-full max-w pl-[37px]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Following</h2>
                <a href="/following" className="text-sm text-gray-400 hover:text-white">
                  Show all
                </a>
              </div>
              <div className="flex">
                {following.map((artist) => (
                  <div
                    key={artist._id}
                    className="text-center hover:bg-[#1F1F1F] h-[235px] w-[180px] rounded px-2 py-2"
                  >
                    <img
                      src={artist.images?.[0]?.url || "https://via.placeholder.com/50"}
                      alt={artist.name}
                      className="w-[160px] h-[160px] object-cover rounded-full shadow-md"
                    />
                    <p className="text-sm mt-2 text-white text-left">{artist.name}</p>
                    <p className="text-sm text-gray-400 text-left">Artist</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      
          {/* Footer Section */}
          <div
            className="absolute top-[1740px] left-0 bg-[#121212] w-full py-6 border-t border-gray-700 "
          >
           <div className="w-full max-w-[970px]  grid grid-cols-4 gap-8 pl-[37px]">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/jobs" className="hover:text-white">
                  Jobs
                </a>
              </li>
              <li>
                <a href="/for-the-record" className="hover:text-white">
                  For the Record
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Communities */}
          <div>
            <h3 className="text-white font-bold mb-4">Communities</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/for-artists" className="hover:text-white">
                  For Artists
                </a>
              </li>
              <li>
                <a href="/developers" className="hover:text-white">
                  Developers
                </a>
              </li>
              <li>
                <a href="/advertising" className="hover:text-white">
                  Advertising
                </a>
              </li>
              <li>
                <a href="/investors" className="hover:text-white">
                  Investors
                </a>
              </li>
              <li>
                <a href="/vendors" className="hover:text-white">
                  Vendors
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Useful links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/support" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="/mobile-app" className="hover:text-white">
                  Free Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Spotify Plans */}
          <div>
            <h3 className="text-white font-bold mb-4">Spotify Plans</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/premium-individual" className="hover:text-white">
                  Premium Individual
                </a>
              </li>
              <li>
                <a href="/premium-duo" className="hover:text-white">
                  Premium Duo
                </a>
              </li>
              <li>
                <a href="/premium-family" className="hover:text-white">
                  Premium Family
                </a>
              </li>
              <li>
                <a href="/premium-student" className="hover:text-white">
                  Premium Student
                </a>
              </li>
              <li>
                <a href="/spotify-free" className="hover:text-white">
                  Spotify Free
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            {/* Left Links */}
            <div className="text-sm text-gray-400 space-x-4">
              <a href="/legal" className="hover:text-white">
                Legal
              </a>
              <a href="/privacy" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="/cookies" className="hover:text-white">
                Cookies
              </a>
              <a href="/ads" className="hover:text-white">
                About Ads
              </a>
              <a href="/accessibility" className="hover:text-white">
                Accessibility
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-instagram text-gray-400 text-lg"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-twitter text-gray-400 text-lg"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <i className="fab fa-facebook text-gray-400 text-lg"></i>
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-4 text-gray-400 text-sm text-center">
            © 2025 Spotify AB
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;