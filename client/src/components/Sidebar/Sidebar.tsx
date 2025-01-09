import { SidebarHeader } from "./SidebarHeader";
import { SidebarPlaylistPrompt } from "./SidebarPlaylistPrompt";
import { SidebarPodcastPrompt } from "./SidebarPodcastPrompt";
import { SidebarLinks } from "./SidebarLinks";
import { SidebarLanguageSelector } from "./SidebarLanguageSelector";
import { useState, useEffect } from "react";
import { useUserContext } from "../../Context/UserContext.tsx";
import SidebarPlaylistAndArtists from "./SidebarPlaylistAndArtists.tsx";

const Sidebar: React.FC = () => {
  const [width, setWidth] = useState<number>(100);
  const { user } = useUserContext();
  const [hasPlaylists, setHasPlaylists] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.playlists) {
      setHasPlaylists(true);
    } else {
      setHasPlaylists(false);
    }
  }, [user]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    let lastX = startX;

    const onMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const deltaX = currentX - lastX;

      setWidth((prevWidth) => {
        const newWidth = prevWidth + deltaX;
        const newWidthPx = (newWidth / 100) * window.innerWidth;
        return newWidthPx >= 300 ? newWidth : (300 / window.innerWidth) * 100;
      });

      lastX = currentX;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex h-full min-w-[30rem] text-textBase">
      <div className="flex-grow">
        <div className="bg-backgroundBase h-full rounded">
          <SidebarHeader />
          <div className="h-fit overflow-auto bg-backgroundBase">
            {user ? (
              <SidebarPlaylistAndArtists />
            ) : (
              <>
                <SidebarPlaylistPrompt />
                <SidebarPodcastPrompt />
                <SidebarLinks />
                <SidebarLanguageSelector />
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="w-[0.1rem] h-full rounded cursor-col-resize hover:bg-essentialSubdued transition-all ml-1 mr-1 duration-300"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export { Sidebar };
