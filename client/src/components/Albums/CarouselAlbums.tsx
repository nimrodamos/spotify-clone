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
  // בדיקה אם albums הוא מערך תקין
  if (!albums || !Array.isArray(albums) || albums.length === 0) {
    return <p className="text-center text-gray-400">No albums available</p>;
  }

  return (
    <div className="flex overflow-auto px-8">
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
