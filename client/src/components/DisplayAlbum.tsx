import { albumsData, assets, songsData } from "@/assets/assets";
import { useParams } from "react-router-dom";

function DisplayAlbum() {
  const { id } = useParams<{ id: string }>();
  console.log("Album ID:", id); // Log the album ID

  const albumData = albumsData[Number(id)];
  console.log("Album Data:", albumData); // Log the album data

  if (!albumData) {
    return <p>Album not found</p>;
  }

  return (
    <>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 rounded"
          src={albumData.image}
          alt={albumData.name}
        />
        <div className="flex flex-col">
          <p className="text-slate-200 text-lg">{albumData.desc}</p>
          <h2 className="font-bold text-5xl mb-4 md:text-7xl">
            {albumData.name}
          </h2>
          <h4>{albumData.desc}</h4>
          <p className="mt-1">
            <img
              className="inline-block w-5"
              src={assets.spotify_logo}
              alt="Spotify logo"
            />
            <b>Spotify</b>• 1,323,154 likes • <b>50 songs,</b> about 2 hr 30 min
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="" />
      </div>
      <hr />
      {songsData.map((song, index) => (
        <div
          key={index}
          className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-0 py-4 pl-2 hover:bg-[#282828] text-sm"
        >
          <p className="flex items-center">
            <span className="mr-4">{index + 1}</span>
            <img className="w-8 h-8 rounded" src={song.image} alt={song.name} />
            <span className="ml-4">{song.name}</span>
          </p>
          <p>{albumData.name}</p>
          <p className="hidden sm:block">Today</p>
          <p className="text-center">{song.duration}</p>
        </div>
      ))}
    </>
  );
}

export default DisplayAlbum;
