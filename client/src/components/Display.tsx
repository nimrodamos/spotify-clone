import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import DisplayPlaylist from "./DisplayPlaylist";
import DisplayArtist from "./DisplayArtist";
import AllAlbums from "./AllAlbums";
import AllArtists from "./AllArtists";
import AllPlaylists from "./AllPlaylists";
import Profile from "./Profile";

const Display = () => {
  return (
    <div className="display-container w-full  rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar lg:w-[75%] lg:ml-0">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route path="/artist/:id" element={<DisplayArtist />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />

        <Route path="/albums" element={<AllAlbums />} />
        <Route path="/artists" element={<AllArtists />} />
        <Route path="/playlists" element={<AllPlaylists />} />
      </Routes>
    </div>
  );
};

export default Display;
