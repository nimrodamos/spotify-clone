import React, {useRef,useCallback ,useMemo ,useEffect}from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppData } from "@/Context/AppDataContext";
import { HiMiniXMark } from "react-icons/hi2";
import { api } from "@/api";
import { ITrack } from "@/types/types";
import { SIDEBAR_CONSTRAINTS } from "@/Context/AppDataContext";
// Define query keys
export const queryKeys = {
  queueTracks: "queueTracks"
};

// Fetch tracks function
export const fetchQueueTracks = async () => {
  try {
    const response = await api.get("/api/tracks/offset?offset=0&limit=21");
    console.log('Queue Tracks API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Queue Tracks API Error:', error);
    throw error;
  }
};

const QueueSidebar: React.FC = () => {
  const { 
    isRsbOpen, 
    setIsRsbOpen, 
    rsbWidth 
  } = useAppData();

  // Tracks Query with memoized selection
  const {
    data: trackData = [],
  } = useQuery({
    queryKey: [queryKeys.queueTracks],
    queryFn: fetchQueueTracks,
    select: useCallback((responseData) => {
      const data = responseData.data || [];
      return data
        .sort(() => 0.5 - Math.random())
        .slice(0, 21);
    }, []),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Derive current song and next songs
  const { currentSong, nextSongs } = useMemo(() => ({
    currentSong: trackData[0] || null,
    nextSongs: trackData.slice(1, 21)
  }), [trackData]);

  // Dynamic width calculations
  const contentWidth = useMemo(() => {
    return Math.max(
      SIDEBAR_CONSTRAINTS.MIN_WIDTH, 
      Math.min(rsbWidth, SIDEBAR_CONSTRAINTS.MAX_WIDTH)
    ) - 40; // Subtract padding
  }, [rsbWidth]);

  // Memoize sidebar content
  const SidebarContent = useMemo(() => {
    return (
      <div className="p-4 mt-[67px]" style={{ width: `${contentWidth}px` }}>
        {/* Now Playing Section */}
        <h2 className="text-md font-bold text-[#EAEAEA] mb-4">Now playing</h2>
        {currentSong && (
          <div 
            className="hover:bg-[#1C1C1C] rounded flex items-center p-2"
            style={{ 
              width: `${contentWidth}px`,
              height: '60px'
            }}
          >
            <img
              src={currentSong.albumCoverUrl || "https://via.placeholder.com/50"}
              alt={currentSong.name}
              className="h-[50px] w-[50px] rounded object-cover"
            />
            <div className="ml-4">
              <p className="text-sm font-bold text-[#1CC458] truncate">
                {currentSong.name}
              </p>
              <p className="text-sm text-[#EAEAEA] truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <h2 className="text-md font-bold text-[#EAEAEA] mt-6 mb-4">Next up</h2>
        <div className="space-y-1">
          {nextSongs.map((song, index) => (
            <div
              key={song.id || index}
              className="hover:bg-[#1C1C1C] rounded flex items-center p-2"
              style={{ 
                width: `${contentWidth}px`,
                height: '60px'
              }}
            >
              <img
                src={song.albumCoverUrl || "https://via.placeholder.com/50"}
                alt={song.name}
                className="h-[50px] w-[50px] rounded object-cover"
              />
              <div className="ml-4">
                <p className="text-sm font-bold text-[#FFFFFF] truncate">
                  {song.name}
                </p>
                <p className="text-sm text-[#787878] truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [currentSong, nextSongs, contentWidth]);

  // Scroll handling effect
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = (event: Event) => {
      event.preventDefault();
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll, { passive: false });
      
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="queue-sidebar-container relative h-full overflow-y-auto bg-[#111213] text-white no-scrollbar"
      style={{ width: `${rsbWidth}px` }}
    >
      {/* Sticky Header */}
      <div
        className="fixed top-[63px] right-[9px] h-[67px] bg-[#111213] flex items-center justify-between px-6 shadow-md z-50 rounded-t"
        style={{ 
          width: `${rsbWidth}px`, 
          color: "#fff" 
        }}
      >
        <h1 className="text-lg font-bold">Queue</h1>
        <HiMiniXMark
          className="text-[#B3B3B3] text-2xl cursor-pointer h-8 w-8 p-1 rounded-full hover:bg-[#1B1B1B]"
          onClick={() => setIsRsbOpen(false)}
        />
      </div>
      
      {SidebarContent}
    </div>
  );
};

export default QueueSidebar;