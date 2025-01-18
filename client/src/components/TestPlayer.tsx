// import React from "react";
// import { useAppData } from "@/Context/AppDataContext";
// import { useUserContext } from "@/Context/UserContext";
// import { useNavigate } from "react-router-dom";
// import CarouselArtists from "./Artists/CarouselArtists";
// import CarouselAlbums from "./Albums/CarouselAlbums";
// import FilterButtons from "./FilterButtons";
// import PersonalizedPlaylists from "./Playlists/PersonalizedPlaylists";

// const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
//   <button onClick={onClick} className=" hover:underline text-sm mb-2">
//     Show All
//   </button>
// );

// const DisplayHome: React.FC = () => {
//   const { user } = useUserContext();
//   const { albums, playlists, artists, loading, error, isRsbOpen } = useAppData(); // Add isRsbOpen
//   const navigate = useNavigate();

//   const [filter, setFilter] = React.useState<"all" | "music" | "podcast">("all");
  
//     const filteredAlbums = React.useMemo(() => {
//       if (filter === "music")
//         return albums.filter((album) => album.genres.includes("music"));
//       if (filter === "podcast") return [];
//       return albums;
//     }, [filter, albums]);
  
//     const filteredArtists = React.useMemo(() => {
//       if (filter === "podcast") return [];
//       return artists;
//     }, [filter, artists]);
  
//     const filteredPlaylists = React.useMemo(() => {
//       if (filter === "music")
//         return playlists.filter((playlist) => playlist.type === "music");
//       if (filter === "podcast")
//         return playlists.filter((playlist) => playlist.type === "podcast");
//       return playlists;
//     }, [filter, playlists]);

//   if (loading) return <div className="text-center text-white">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="min-h-full w-full">
//       <div className="bg-gradient-to-b from-[#141b14] via-backgroundBase/100 to-backgroundBase w-full p-4">
//         {user && <FilterButtons filter={filter} setFilter={setFilter} />}

//         {user && (
//           <div className="mb-8">
//             <h1 className="px-4 my-5 font-bold text-2xl">
//               Made for {user.displayName}
//             </h1>
//             <PersonalizedPlaylists playlists={filteredPlaylists} />
//           </div>
//         )}

// <div className="flex justify-between items-center px-4 mb-4">
//           <h1
//             className="font-bold text-2xl cursor-pointer hover:underline"
//             onClick={() => navigate("/artists")}
//           >
//             Popular Artists
//           </h1>
//           <ShowAllButton onClick={() => navigate("/artists")} />
//         </div>
//         <CarouselArtists artists={filteredArtists} />

//         <div className="flex justify-between items-center px-4 mb-4">
//           <h1
//             className="font-bold text-2xl cursor-pointer hover:underline"
//             onClick={() => navigate("/albums")}
//           >
//             Featured Albums
//           </h1>
//           <ShowAllButton onClick={() => navigate("/albums")} />
//         </div>
//         <CarouselAlbums albums={filteredAlbums} />
//       </div>
//     </div>
//   );
// };

// export default DisplayHome;

// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   ReactNode,
// } from "react";
// import { api } from "@/api";
// import { IAlbum, IArtist, IPlaylist, ITrack } from "@/types/types";

// type RsbMode = "queue" | "song";

// interface AppDataContextType {
//   albums: IAlbum[];
//   artists: IArtist[];
//   playlists: IPlaylist[];
//   tracks: ITrack[];
//   loading: boolean;
//   error: string | null;
//   isRsbOpen: boolean;
//   rsbMode: RsbMode;
//   toggleRsb: (mode: RsbMode) => void;
//   setRsbMode: (mode: RsbMode) => void;
//   setIsRsbOpen: (isOpen: boolean) => void;
//   fetchAlbumById: (id: string) => Promise<IAlbum | null>;
// }

// const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// export const AppDataProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [albums, setAlbums] = useState<IAlbum[]>([]);
//   const [artists, setArtists] = useState<IArtist[]>([]);
//   const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
//   const [tracks, setTracks] = useState<ITrack[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRsbOpen, setIsRsbOpen] = useState<boolean>(false);
//   const [rsbMode, setRsbMode] = useState<RsbMode>("queue");

//   const toggleRsb = (mode: RsbMode) => {
//     if (isRsbOpen && rsbMode === mode) {
//       setIsRsbOpen(false);
//     } else {
//       setRsbMode(mode);
//       setIsRsbOpen(true);
//     }
//   };

//   const fetchAlbums = async () => {
//     try {
//       const response = await api.get(
//         "/api/albums/limited?limit=20&random=true"
//       );
//       setAlbums(response.data);
//     } catch (err: any) {
//       setError("Failed to fetch albums.");
//     }
//   };

//   const fetchArtists = async () => {
//     try {
//       const response = await api.get(
//         "/api/artists/limited?limit=20&random=true"
//       );
//       setArtists(response.data);
//     } catch (err: any) {
//       setError("Failed to fetch artists.");
//     }
//   };

//   const fetchPlaylists = async () => {
//     try {
//       const response = await api.get("/api/playlists");
//       setPlaylists(response.data);
//     } catch (err: any) {
//       setError("Failed to fetch playlists.");
//     }
//   };

//   const fetchTracks = async () => {
//     try {
//       const response = await api.get("/api/tracks");
//       setTracks(response.data);
//     } catch (err: any) {
//       setError("Failed to fetch tracks.");
//     }
//   };

//   const fetchAlbumById = async (id: string): Promise<IAlbum | null> => {
//     try {
//       const response = await api.get(`/api/albums/${id}`);
//       return response.data;
//     } catch {
//       return null;
//     }
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchAlbums(),
//         fetchArtists(),
//         fetchPlaylists(),
//         fetchTracks(),
//       ]);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   return (
//     <AppDataContext.Provider
//       value={{
//         albums,
//         artists,
//         playlists,
//         tracks,
//         loading,
//         error,
//         isRsbOpen,
//         rsbMode,
//         toggleRsb,
//         setRsbMode,
//         setIsRsbOpen,
//         fetchAlbumById,
//       }}
//     >
//       {children}
//     </AppDataContext.Provider>
//   );
// };

// export const useAppData = () => {
//   const context = useContext(AppDataContext);
//   if (!context) {
//     throw new Error("useAppData must be used within an AppDataProvider");
//   }
//   return context;
// };
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../Context/UserContext";
import { useAppData } from "../../Context/AppDataContext";
import { IArtist, ITrack } from "@/types/types";
import { api } from "@/api";

// Import section components
import { ProfileSection } from "./sections/ProfileSection";
import { TopArtistsSection } from "./sections/TopArtistsSection";
import { TopTracksSection } from "./sections/TopTracksSection";
import { FollowersSection } from "./sections/FollowersSection";
import { FollowingSection } from "./sections/FollowingSection";
import { FooterSection } from "./sections/FooterSection";

const Profile: React.FC = () => {
  const { user } = useUserContext();
  const { isRsbOpen } = useAppData();
  const [topArtists, setTopArtists] = useState<IArtist[]>([]);
  const [topTracks, setTopTracks] = useState<ITrack[]>([]);
  const [followers, setFollowers] = useState<IArtist[]>([]);
  const [following, setFollowing] = useState<IArtist[]>([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const profileWidth = isRsbOpen ? "77.1%" : "81.4%";
  const displayLimit = isRsbOpen ? 6 : 8;

  useEffect(() => {
    if (!user) return;

    async function fetchTopArtists() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setTopArtists(
          artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
        );
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    }

    async function fetchTopTracks() {
      try {
        const response = await api.get("/api/tracks");
        const tracks: ITrack[] = response.data;
        setTopTracks(tracks.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }

    async function fetchFollowers() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setFollowers(
          artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
        );
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    }

    async function fetchFollowing() {
      try {
        const response = await api.get("/api/artists");
        const artists: IArtist[] = response.data;
        setFollowing(
          artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
        );
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    }

    fetchTopArtists();
    fetchTopTracks();
    fetchFollowers();
    fetchFollowing();

    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      // Changed from 340 to a smaller value for earlier trigger
      setShowStickyHeader(container.scrollTop > 250);
    };

    // Change scroll listener to target the closest scroll container
    const scrollContainer = document.querySelector('.display-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [user, displayLimit]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {showStickyHeader && (
        <div className="sticky top-0 h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-[100] rounded-t">
          <h1 className="text-xl font-bold">{user.displayName}</h1>
        </div>
      )}
      
      <div className="relative pb-[150px]"> {/* Added padding bottom to account for player */}
        <ProfileSection user={user} profileWidth={profileWidth} />
        
        {/* Changed from absolute to relative positioning */}
        <div className="relative bg-[#121212]/25 backdrop-blur-sm">
          <TopArtistsSection artists={topArtists} />
        </div>

        <div className="relative bg-[#121212] backdrop-blur-sm">
          <TopTracksSection tracks={topTracks} />
        </div>

        <div className="relative bg-[#121212] backdrop-blur-sm">
          <FollowersSection followers={followers} />
        </div>

        <div className="relative bg-[#121212]/50 backdrop-blur-sm">
          <FollowingSection following={following} />
        </div>

        <div className="relative bg-[#121212] border-t border-gray-700">
          <FooterSection />
        </div>
      </div>
    </div>
  );
};