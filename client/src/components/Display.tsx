import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./Albums/DisplayAlbum";
import DisplayPlaylist from "./Playlists/DisplayPlaylist";
import DisplayArtist from "./Artists/DisplayArtist";
import AllAlbums from "./Albums/AllAlbums";
import AllArtists from "./Artists/AllArtists";
import AllPlaylists from "./Playlists/AllPlaylists";
import Profile from "./Profile";
import DisplayTrack from "./DisplayTrack";

interface DisplayProps {
  isRsbOpen: boolean;
}

const Display: React.FC<DisplayProps> = ({ isRsbOpen }) => {
  return (
    <div
      className={`display-container rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar transition-all duration-300 ${
        isRsbOpen ? "lg:w-[75%]" : "lg:w-[80%]"
      }`}
    >
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/artist/:id" element={<DisplayArtist />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
        <Route path="/track/:id" element={<DisplayTrack />} />

        <Route path="/albums" element={<AllAlbums />} />
        <Route path="/artists" element={<AllArtists />} />
        <Route path="/playlists" element={<AllPlaylists />} />
      </Routes>
    </div>
  );
};

export default Display;
