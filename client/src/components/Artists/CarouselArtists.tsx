import React from "react";
import CardItem from "../CardItem";

interface CarouselArtistsProps {
  artists?: Array<{
    external_urls: { spotify: string };
    name: string;
    genres: string[];
    images: { url: string }[];
  }> | null;
}

const CarouselArtists: React.FC<CarouselArtistsProps> = ({ artists }) => {
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return <p className="text-center text-gray-400">No artists available</p>;
  }

  return (
    <div className="flex overflow-auto scrollbar-hide">
      {artists.map((artist) => (
        <CardItem
          key={artist.external_urls.spotify.split("/").pop()}
          name={artist.name}
          desc={
            artist.genres.length > 0
              ? artist.genres.join(", ")
              : "No genres available"
          }
          id={artist.external_urls.spotify.split("/").pop() || "default-id"}
          image={artist.images?.[0]?.url || "/default-artist.jpg"}
          type="artist"
        />
      ))}
    </div>
  );
};

export default CarouselArtists;
