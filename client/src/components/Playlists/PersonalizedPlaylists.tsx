import React from "react";
import CardItem from "../CardItem";

interface PersonalizedPlaylistsProps {
  playlists: Array<{
    _id: string;
    PlaylistTitle: string;
    description: string;
    customAlbumCover?: string;
  }>;
}

const PersonalizedPlaylists: React.FC<PersonalizedPlaylistsProps> = ({
  playlists,
}) => (
  <div className="flex overflow-auto scrollbar-hide">
    {playlists.map((playlist) => (
      <CardItem
        key={playlist._id}
        name={playlist.PlaylistTitle}
        desc={playlist.description}
        id={playlist._id}
        image={playlist.customAlbumCover || ""}
        type="playlist"
      />
    ))}
  </div>
);

export default PersonalizedPlaylists;
