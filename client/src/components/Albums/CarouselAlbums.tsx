import React from "react";
import CardItem from "../CardItem";

interface CarouselAlbumsProps {
  albums: Array<{
    spotifyAlbumId: string;
    name: string;
    artist: string;
    albumCoverUrl: string;
  }>;
}

const CarouselAlbums: React.FC<CarouselAlbumsProps> = ({ albums }) => (
  <div className="flex overflow-auto px-8">
    {albums.map((album) => (
      <CardItem
        key={album.spotifyAlbumId}
        name={album.name}
        desc={album.artist}
        id={album.spotifyAlbumId}
        image={album.albumCoverUrl}
        type="album"
      />
    ))}
  </div>
);

export default CarouselAlbums;
