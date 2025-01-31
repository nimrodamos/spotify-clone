import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./Albums/DisplayAlbum";
import DisplayPlaylist from "./Playlists/DisplayPlaylist";
import DisplayArtist from "./Artists/DisplayArtist";
import AllAlbums from "./Albums/AllAlbums";
import AllArtists from "./Artists/AllArtists";
import AllPlaylists from "./Playlists/AllPlaylists";
import Profile from "./Profile/Profile";
import DisplayTrack from "./DisplayTrack";
import SearchResults from "./DisplaySearch/SearchResults";
import BrowseAll from "./Browse/BrowseAll";
import CategoryPage from "./Browse/CategoryPage";
import WhatsNew from "./WhatsNew";
import DisplayLyrics from "./DisplayLyrics";

const Display: React.FC = () => {
  return (
    <div className="display-container">
      <Routes>
        <Route path="/browse" element={<BrowseAll />} />
        <Route path="/Lyrics" element={<DisplayLyrics />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/whatsNew" element={<WhatsNew />} />
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
