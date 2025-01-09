import { SidebarHeader } from "./SidebarHeader";
import { SidebarPlaylistPrompt } from "./SidebarPlaylistPrompt";
import { SidebarPodcastPrompt } from "./SidebarPodcastPrompt";
import { SidebarLinks } from "./SidebarLinks";
import { SidebarLanguageSelector } from "./SidebarLanguageSelector";
import { useState } from "react";
import { useUserContext } from "../../Context/UserContext.tsx";
import SidebarPlaylistAndArtists from "./SidebarPlaylistAndArtists";

const Sidebar: React.FC = () => {
  const [width, setWidth] = useState<number>(100);
  const { user } = useUserContext();
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
    <div className="flex h-full">
      <div
        className="h-full rounded flex-col mr-2 gap-2 text-textBase hidden lg:flex"
        style={{
          width: `${width}%`,
          backgroundColor: "#1e1e1e",
          minWidth: "300px",
          maxWidth: "100%",
        }}
      >
        <div className="bg-backgroundBase h-full rounded">
          <SidebarHeader />
          {user && user.playlists && user.playlists.length > 0 ? (
            <SidebarPlaylistAndArtists />
          ) : (
            <>
              <SidebarPlaylistPrompt />
              <SidebarPodcastPrompt />
            </>
          )}
          <SidebarPlaylistAndArtists />
          <SidebarLinks />
          <SidebarLanguageSelector />
        </div>
      </div>
      <div
        className="w-[1%] h-full cursor-col-resize hover:bg-essentialSubdued transition-all duration-300 mr-2"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export { Sidebar };
