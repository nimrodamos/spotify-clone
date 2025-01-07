import { Route, Routes } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";

import DisplayPlaylist from "./DisplayPlaylist";
import DisplayArtist from "./DisplayArtist";

const Display = () => {
  return (
    <div className="w-full px-6 pt-4 rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar lg:w-[75%] lg:ml-0">
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayAlbum />} />
        <Route
          path="/artist/:id"
          element={
            <DisplayArtist
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
