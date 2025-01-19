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
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  const { isRsbOpen, isLsbOpen, lsbWidth, rsbWidth } = useAppData();
  
  const [scrollPosition, setScrollPosition] = useState(0);

  const { displayLimit, profileWidth } = useMemo(() => ({
    displayLimit: isRsbOpen ? 6 : 8,
    profileWidth: isRsbOpen ? "77.1%" : "81.4%"
  }), [isRsbOpen]);

  // Artists Query with memoized selection
  const {
    data: topArtists = [],
  } = useQuery({
    queryKey: [queryKeys.topArtists, displayLimit],
    queryFn: fetchArtists,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, displayLimit);
    }, [displayLimit]),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!user,
  });

  // Tracks Query
  const {
    data: topTracks = [],
  } = useQuery({
    queryKey: [queryKeys.topTracks],
    queryFn: fetchTracks,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    }, []),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!user,
  });

  // Followers Query
  const {
    data: followers = [],
  } = useQuery({
    queryKey: [queryKeys.followers, displayLimit],
    queryFn: fetchArtists,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, displayLimit);
    }, [displayLimit]),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!user,
  });

  // Following Query
  const {
    data: following = [],
  } = useQuery({
    queryKey: [queryKeys.following, displayLimit],
    queryFn: fetchArtists,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, displayLimit);
    }, [displayLimit]),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!user,
  });
  

    // Comprehensive scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const displayContainer = document.querySelector('.display-container') as HTMLElement;
      
      if (displayContainer) {
        const scrollTop = displayContainer.scrollTop;
        setScrollPosition(scrollTop);
      }
    };

    const displayContainer = document.querySelector('.display-container');
    
    if (displayContainer) {
      displayContainer.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        displayContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Calculate dynamic positioning based on sidebar states
  const stickyHeaderStyle = useMemo(() => {
    const basePadding = 8; // 2 * p-2 in the Main.tsx
    const lsbWidth = isLsbOpen ? 
      (document.querySelector('.display-container')?.parentElement?.querySelector(':first-child')?.clientWidth || 72) 
      : 72;

    return {
      left: `${lsbWidth + basePadding}px`,
      width: isRsbOpen 
        ? `calc(100% - ${lsbWidth + (rsbWidth || 0) + 2 * basePadding}px)` 
        : `calc(100% - ${lsbWidth + basePadding * 2}px)`
    };
  }, [isLsbOpen, isRsbOpen, rsbWidth]);

  const ProfileContent = useMemo(() => {
    if (!user) {
      return (
        <p className="text-center text-lg text-white">
          Please log in to view your profile.
        </p>
      );
    }

    return (
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
    );
  }, [
    user, 
    topArtists, 
    topTracks, 
    followers, 
    following, 
    profileWidth
  ]);

  return (
    <>
      {scrollPosition > 340 && (
        <div 
        className="fixed top-[63px] h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-[100] rounded-t"
        style={{
          left: `calc(9px + ${isLsbOpen ? lsbWidth : 72})px`,
          width: `calc(100% - ${isLsbOpen ? lsbWidth : 72}px - ${isRsbOpen ? rsbWidth : 0}px - 32px)`
        }}
      >
          <h1 className="text-xl font-bold text-white">{user?.displayName}</h1>
        </div>
      )}
      
      {ProfileContent}
    </>
  );
};

export default Profile;