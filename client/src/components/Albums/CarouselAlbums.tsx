import React from "react";
import CardItem from "../CardItem";

interface CarouselAlbumsProps {
  albums?: Array<{
    spotifyAlbumId: string;
    name: string;
    artist: string;
    albumCoverUrl: string;
  }> | null;
}

const CarouselAlbums: React.FC<CarouselAlbumsProps> = ({ albums }) => {
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    console.error("Invalid albums data:", albums);
    return <p className="text-center text-gray-400">No albums available</p>;
  }

  return (
    <div className="flex overflow-auto scrollbar-hide">
      {albums.map((album) => (
        <CardItem
          key={album.spotifyAlbumId}
          name={album.name}
          desc={album.artist}
          id={album.spotifyAlbumId}
          image={album.albumCoverUrl || "/default-album.jpg"}
          type="album"
        />
      ))}
    </div>
  );
};

export default CarouselAlbums;
