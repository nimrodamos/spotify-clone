//? // // // // / // // // // / /
// import React, { useEffect, useState } from "react";
// import { useUserContext } from "../../Context/UserContext";
// import { useAppData } from "../../Context/AppDataContext";
// import { IArtist, ITrack } from "@/types/types";
// import { api } from "@/api";

// // Import section components
// import { ProfileSection } from "./sections/ProfileSection";
// import { TopArtistsSection } from "./sections/TopArtistsSection";
// import { TopTracksSection } from "./sections/TopTracksSection";
// import { FollowersSection } from "./sections/FollowersSection";
// import { FollowingSection } from "./sections/FollowingSection";
// import { FooterSection } from "./sections/FooterSection";
// import { profile } from "console";

// const Profile: React.FC = () => {
//   const { user } = useUserContext();
//   const { isRsbOpen } = useAppData();
//   const [topArtists, setTopArtists] = useState<IArtist[]>([]);
//   const [topTracks, setTopTracks] = useState<ITrack[]>([]);
//   const [followers, setFollowers] = useState<IArtist[]>([]);
//   const [following, setFollowing] = useState<IArtist[]>([]);
//   const [showStickyHeader, setShowStickyHeader] = useState(false);

//   const profileWidth = isRsbOpen ? "77.1%" : "81.4%";
//   const displayLimit = isRsbOpen ? 6 : 8;

//   useEffect(() => {
//     if (!user) return;

//     async function fetchTopArtists() {
//       try {
//         const response = await api.get("/api/artists");
//         const artists: IArtist[] = response.data;
//         setTopArtists(
//           artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
//         );
//       } catch (error) {
//         console.error("Error fetching artists:", error);
//       }
//     }

//     async function fetchTopTracks() {
//       try {
//         const response = await api.get("/api/tracks");
//         const tracks: ITrack[] = response.data;
//         setTopTracks(tracks.sort(() => 0.5 - Math.random()).slice(0, 4));
//       } catch (error) {
//         console.error("Error fetching tracks:", error);
//       }
//     }

//     async function fetchFollowers() {
//       try {
//         const response = await api.get("/api/artists");
//         const artists: IArtist[] = response.data;
//         setFollowers(
//           artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
//         );
//       } catch (error) {
//         console.error("Error fetching followers:", error);
//       }
//     }

//     async function fetchFollowing() {
//       try {
//         const response = await api.get("/api/artists");
//         const artists: IArtist[] = response.data;
//         setFollowing(
//           artists.sort(() => 0.5 - Math.random()).slice(0, displayLimit)
//         );
//       } catch (error) {
//         console.error("Error fetching following:", error);
//       }
//     }

//     fetchTopArtists();
//     fetchTopTracks();
//     fetchFollowers();
//     fetchFollowing();

//     const handleScroll = (e: Event) => {
//       const container = e.target as HTMLElement;
//       // Changed from 340 to a smaller value for earlier trigger
//       setShowStickyHeader(container.scrollTop > 250);
//     };

//     // Change scroll listener to target the closest scroll container
//     const scrollContainer = document.querySelector('.display-container');
//     if (scrollContainer) {
//       scrollContainer.addEventListener('scroll', handleScroll);

//       return () => {
//         scrollContainer.removeEventListener('scroll', handleScroll);
//       };
//     }
//   }, [user, displayLimit]);

//   return (
//     <div className="h-full overflow-y-auto custom-scrollbar">
//       {showStickyHeader && (
//         <div className="sticky top-0 h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-[100] rounded-t">
//           <h1 className="text-xl font-bold">{user.displayName}</h1>
//         </div>
//       )}
      
//       <div className="relative pb-[150px]"> {/* Added padding bottom to account for player */}
//         <ProfileSection user={user} profileWidth={profileWidth} />
        
//         {/* Changed from absolute to relative positioning */}
//         <div className="relative bg-[#121212]/25 backdrop-blur-sm">
//           <TopArtistsSection artists={topArtists} />
//         </div>

//         <div className="relative bg-[#121212] backdrop-blur-sm">
//           <TopTracksSection tracks={topTracks} />
//         </div>

//         <div className="relative bg-[#121212] backdrop-blur-sm">
//           <FollowersSection followers={followers} />
//         </div>

//         <div className="relative bg-[#121212]/50 backdrop-blur-sm">
//           <FollowingSection following={following} />
//         </div>

//         <div className="relative bg-[#121212] border-t border-gray-700">
//           <FooterSection />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile
//! // // // // // // // // 
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../Context/UserContext";
import { useAppData } from "../../Context/AppDataContext";
import { IArtist, ITrack } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, fetchArtists, fetchTracks } from "@/types/queries";

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
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const displayLimit = isRsbOpen ? 6 : 8;
  const profileWidth = isRsbOpen ? "77.1%" : "81.4%";
  // Artists Query
  const {
    data: topArtists = [],
    isLoading: artistsLoading,
    error: artistsError
  } = useQuery({
    queryKey: [queryKeys.topArtists],
    queryFn: fetchArtists,
    select: (data) => {
      console.log('Artists data received:', data);
      return data.sort(() => 0.5 - Math.random()).slice(0, displayLimit);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user
  });

  // Tracks Query
  const {
    data: topTracks = [],
    isLoading: tracksLoading,
    error: tracksError
  } = useQuery({
    queryKey: [queryKeys.topTracks],
    queryFn: fetchTracks,
    select: (data) => {
      console.log('Tracks data received:', data);
      return data.sort(() => 0.5 - Math.random()).slice(0, 4);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user
  });

  // Followers Query
  const {
    data: followers = [],
    isLoading: followersLoading,
    error: followersError
  } = useQuery({
    queryKey: [queryKeys.followers],
    queryFn: fetchArtists,
    select: (data) => {
      console.log('Followers data received:', data);
      return data.sort(() => 0.5 - Math.random()).slice(0, displayLimit);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user
  });

  // Following Query
  const {
    data: following = [],
    isLoading: followingLoading,
    error: followingError
  } = useQuery({
    queryKey: [queryKeys.following],
    queryFn: fetchArtists,
    select: (data) => {
      console.log('Following data received:', data);
      return data.sort(() => 0.5 - Math.random()).slice(0, displayLimit);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!user
  });

  // Debug logs for all queries
  useEffect(() => {
    console.log('User object:', user);
    
    if (artistsLoading) console.log('Artists loading...');
    if (artistsError) console.error('Artists error:', artistsError);
    
    if (tracksLoading) console.log('Tracks loading...');
    if (tracksError) console.error('Tracks error:', tracksError);
    
    if (followersLoading) console.log('Followers loading...');
    if (followersError) console.error('Followers error:', followersError);
    
    if (followingLoading) console.log('Following loading...');
    if (followingError) console.error('Following error:', followingError);
  }, [
    user,
    artistsLoading, artistsError,
    tracksLoading, tracksError,
    followersLoading, followersError,
    followingLoading, followingError
  ]);

  // Log data updates
  useEffect(() => {
    console.log('Current data state:', {
      topArtists,
      topTracks,
      followers,
      following
    });
  }, [topArtists, topTracks, followers, following]);
  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      setShowStickyHeader(container.scrollTop > 340);
    };

    const displayContainer = document.querySelector('.display-container');
    if (displayContainer) {
      displayContainer.addEventListener('scroll', handleScroll);
      return () => {
        displayContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (!user) {
    return (
      <p className="text-center text-lg text-white">
        Please log in to view your profile.
      </p>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      {showStickyHeader && (
        <div className="sticky top-0 h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-[100] rounded-t">
          <h1 className="text-xl font-bold">{user.displayName}</h1>
        </div>
      )}
      
      <div className="relative pb-[150px]">
        <ProfileSection user={user} profileWidth={profileWidth} />
        
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

export default Profile;