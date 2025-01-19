import React from "react";
import CardItem from "../CardItem";

interface CarouselArtistsProps {
  artists?: Array<{
    _id: string;
    name: string;
    genres: string[];
    images: { url: string }[];
  }> | null;
}

const CarouselArtists: React.FC<CarouselArtistsProps> = ({ artists }) => {
  // בדיקה אם artists הוא מערך תקין
  if (!artists || !Array.isArray(artists) || artists.length === 0) {
    return <p className="text-center text-gray-400">No artists available</p>;
  }

  return (
    <div className="flex overflow-auto px-8">
      {artists.map((artist) => (
        <CardItem
          key={artist._id}
          name={artist.name}
          desc={
            artist.genres.length > 0
              ? artist.genres.join(", ")
              : "No genres available"
          }
          id={artist._id}
          image={artist.images?.[0]?.url || "/default-artist.jpg"}
          type="artist"
        />
      ))}
    </div>
  );
};

export default CarouselArtists;
