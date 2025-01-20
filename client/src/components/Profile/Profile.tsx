
// //! // // // // // // // // 
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
      <div className="h-full relative">
        {/* Profile Hero Section - Full height */}
        <ProfileSection user={user} profileWidth={profileWidth} />
        
        {/* Content that starts at 340px and overlaps */}
        <div className="absolute top-[340px] left-0 right-0 z-10">
          <div className="bg-[#121212]/25 backdrop-blur-sm">
            <TopArtistsSection artists={topArtists} />
          </div>
  
          <div className="bg-[#121212] backdrop-blur-sm">
            <TopTracksSection tracks={topTracks} />
          </div>
  
          <div className="bg-[#121212] backdrop-blur-sm">
            <FollowersSection followers={followers} />
          </div>
  
          <div className="bg-[#121212]/50 backdrop-blur-sm">
            <FollowingSection following={following} />
          </div>
  
          <div className="bg-[#121212] border-t border-gray-700">
            <FooterSection />
          </div>
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
// import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
// import { useUserContext } from "../../Context/UserContext";
// import { useAppData } from "../../Context/AppDataContext";
// import { IArtist, ITrack } from "@/types/types";
// import { useQuery } from "@tanstack/react-query";
// import { queryKeys, fetchArtists, fetchTracks } from "@/types/queries";

// // Import section components
// import { ProfileSection } from "./sections/ProfileSection";
// import { TopArtistsSection } from "./sections/TopArtistsSection";
// import { TopTracksSection } from "./sections/TopTracksSection";
// import { FollowersSection } from "./sections/FollowersSection";
// import { FollowingSection } from "./sections/FollowingSection";
// import { FooterSection } from "./sections/FooterSection";

// // Interface for section layout calculations
// interface SectionLayout {
//   displayLimit: number;
//   gap: number;
//   itemWidth: number;
// }

// const Profile: React.FC = () => {
//   const { user } = useUserContext();
//   const { isRsbOpen, isLsbOpen, lsbWidth, rsbWidth } = useAppData();
//   const [scrollPosition, setScrollPosition] = useState(0);
//   const [sectionLayout, setSectionLayout] = useState<SectionLayout>({
//     displayLimit: 6,
//     gap: 16,
//     itemWidth: 180
//   });

//   const { displayLimit, profileWidth } = useMemo(() => ({
//       displayLimit: isRsbOpen ? 6 : 8,
//       profileWidth: isRsbOpen ? "77.1%" : "81.4%"
//     }), [isRsbOpen]);

//   // Calculate dynamic section layout
//   const calculateSectionLayout = useCallback(() => {
//     const displayContainer = document.querySelector('.display-container') as HTMLElement;
//     if (!displayContainer) return;

//     const containerWidth = displayContainer.clientWidth - 74; // Account for padding
//     const minGap = 16; // We'll keep a consistent gap
//     const minItemWidth = 180;
    
//     // Calculate how many items can fit with the minimum width
//     const possibleItems = Math.floor((containerWidth + minGap) / (minItemWidth + minGap));
//     const itemCount = Math.max(2, Math.min(10, possibleItems));
    
//     // Calculate the actual item width to fill the space
//     // Total available width minus total gap space, divided by number of items
//     const actualItemWidth = Math.floor((containerWidth - (minGap * (itemCount - 1))) / itemCount);

//     setSectionLayout({
//       displayLimit: itemCount,
//       itemWidth: actualItemWidth,
//       gap: minGap
//     });
//   }, []);

//   // Setup resize observer
//   useEffect(() => {
//     const displayContainer = document.querySelector('.display-container');
//     if (!displayContainer) return;

//     const resizeObserver = new ResizeObserver(() => {
//       calculateSectionLayout();
//     });

//     resizeObserver.observe(displayContainer);
//     calculateSectionLayout(); // Initial calculation

//     return () => resizeObserver.disconnect();
//   }, [calculateSectionLayout]);

//   // Artists Query with dynamic limit
//   const {
//     data: topArtists = [],
//   } = useQuery({
//     queryKey: [queryKeys.topArtists, sectionLayout.displayLimit],
//     queryFn: fetchArtists,
//     select: useCallback((responseData) => {
//       const data = responseData.data || [];
//       return data
//         .sort(() => 0.5 - Math.random())
//         .slice(0, sectionLayout.displayLimit);
//     }, [sectionLayout.displayLimit]),
//     staleTime: Infinity,
//     gcTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//     enabled: !!user,
//   });

//    // Tracks Query
//    const {
//      data: topTracks = [],
//    } = useQuery({
//      queryKey: [queryKeys.topTracks],
//      queryFn: fetchTracks,
//      select: useCallback((responseData) => {
//        const data = responseData.data || [];
//        return data
//          .sort(() => 0.5 - Math.random())
//          .slice(0, 4);
//      }, []),
//      staleTime: Infinity,
//      gcTime: Infinity,
//      refetchOnWindowFocus: false,
//      refetchOnReconnect: false,
//      refetchOnMount: false,
//      enabled: !!user,
//    });
 
//    // Followers Query
//    const {
//      data: followers = [],
//    } = useQuery({
//      queryKey: [queryKeys.followers, displayLimit],
//      queryFn: fetchArtists,
//      select: useCallback((responseData) => {
//        const data = responseData.data || [];
//        return data
//          .sort(() => 0.5 - Math.random())
//          .slice(0, displayLimit);
//      }, [displayLimit]),
//      staleTime: Infinity,
//      gcTime: Infinity,
//      refetchOnWindowFocus: false,
//      refetchOnReconnect: false,
//      refetchOnMount: false,
//      enabled: !!user,
//    });
 
//    // Following Query
//    const {
//      data: following = [],
//    } = useQuery({
//      queryKey: [queryKeys.following, displayLimit],
//      queryFn: fetchArtists,
//      select: useCallback((responseData) => {
//        const data = responseData.data || [];
//        return data
//          .sort(() => 0.5 - Math.random())
//          .slice(0, displayLimit);
//      }, [displayLimit]),
//      staleTime: Infinity,
//      gcTime: Infinity,
//      refetchOnWindowFocus: false,
//      refetchOnReconnect: false,
//      refetchOnMount: false,
//      enabled: !!user,
//    });

//   // Scroll handling
//   useEffect(() => {
//     const handleScroll = () => {
//       const displayContainer = document.querySelector('.display-container') as HTMLElement;
//       if (displayContainer) {
//         setScrollPosition(displayContainer.scrollTop);
//       }
//     };

//     const displayContainer = document.querySelector('.display-container');
//     if (displayContainer) {
//       displayContainer.addEventListener('scroll', handleScroll, { passive: true });
//       return () => {
//         displayContainer.removeEventListener('scroll', handleScroll);
//       };
//     }
//   }, []);

//   // Profile content with dynamic layout
//   const ProfileContent = useMemo(() => {
//     if (!user) {
//       return (
//         <p className="text-center text-lg text-white">
//           Please log in to view your profile.
//         </p>
//       );
//     }

//     return (
//       <div className="h-full relative">
//         <ProfileSection user={user} profileWidth={isRsbOpen ? "77.1%" : "81.4%"} />
        
//         <div className="absolute top-[340px] left-0 right-0 z-10">
//           <div className="bg-[#121212]/25 backdrop-blur-sm">
//             <TopArtistsSection 
//               artists={topArtists} 
//               displayLimit={sectionLayout.displayLimit}
//               gap={sectionLayout.gap}
//               itemWidth={sectionLayout.itemWidth}
//             />
//           </div>

//           <div className="bg-[#121212] backdrop-blur-sm">
//             <TopTracksSection tracks={topTracks} />
//           </div>

//           <div className="bg-[#121212] backdrop-blur-sm">
//             <FollowersSection followers={followers} />
//           </div>

//           <div className="bg-[#121212]/50 backdrop-blur-sm">
//             <FollowingSection following={following} />
//           </div>

//           <div className="bg-[#121212] border-t border-gray-700">
//             <FooterSection />
//           </div>
//         </div>
//       </div>
//     );
//   }, [user, topArtists, topTracks, followers, following, isRsbOpen, sectionLayout]);

//   return (
//     <>
//       {scrollPosition > 340 && (
//         <div 
//           className="fixed top-[63px] h-[67px] bg-[#4A5A2D] flex items-center px-6 shadow-md z-[100] rounded-t"
//           style={{
//             left: `calc(9px + ${isLsbOpen ? lsbWidth : 72}px)`,
//             width: `calc(100% - ${isLsbOpen ? lsbWidth : 72}px - ${isRsbOpen ? rsbWidth : 0}px - 32px)`
//           }}
//         >
//           <h1 className="text-xl font-bold text-white">{user?.displayName}</h1>
//         </div>
//       )}
//       {ProfileContent}
//     </>
//   );
// };

// export default Profile;