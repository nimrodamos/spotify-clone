import React from "react";
import CardItem from "../CardItem";

interface CarouselArtistsProps {
  artists: Array<{
    _id: string;
    name: string;
    genres: string[];
    images: { url: string }[];
  }>;
}

const CarouselArtists: React.FC<CarouselArtistsProps> = ({ artists }) => (
  <div className="flex overflow-auto px-8">
    {artists.map((artist) => (
      <CardItem
        key={artist._id}
        name={artist.name}
        desc={artist.genres.join(", ")}
        id={artist._id}
        image={artist.images[0]?.url || ""}
        type="artist"
      />
    ))}
  </div>
);

export default CarouselArtists;
