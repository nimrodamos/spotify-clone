import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import ArtistItem from "./ArtistItem";
import DisplayPlaylist from "./DisplayPlaylist";

const Display = () => {
  return (
    <div className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar lg:w-[75%] lg:ml-0">
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route
          path="/artist/:id"
          element={
            <ArtistItem
              name="Artist Name"
              desc="Artist Description"
              image="Artist Image URL"
            />
          }
        />
        <Route path="/playlist/:id" element={<DisplayPlaylist />} />
      </Routes>
    </div>
  );
};

export default Display;
