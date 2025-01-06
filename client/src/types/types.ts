interface IUser {
  _id: string;
  email?: string;
  password?: string;
  gender:
    | "Man"
    | "Woman"
    | "Non-binary"
    | "Undefined"
    | "Something-Else"
    | "Prefer-Not-To-Say";
  dateOfBirth: Date;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  premium: boolean;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
}

interface IAlbum {
  _id: string;
  spotifyAlbumId: string;
  name: string;
  artist: string;
  releaseDate: string;
  totalTracks: number;
  genres: string[];
  albumCoverUrl: string;
  spotifyUrl: string;
  popularity?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ITrack {
  _id: string;
  spotifyTrackId: string;
  name: string;
  artist: string;
  album: string;
  albumCoverUrl: string;
  durationMs: number;
}

interface IPlaylistTrack {
  spotifyTrackId: string;
  name: string;
  artist: string;
  album: string;
  albumCoverUrl: string;
  durationMs: number;
  addedAt: Date;
}

interface IPlaylist {
  _id: string;
  PlaylistTitle: string;
  description: string;
  owner: string;
  tracks: IPlaylistTrack[];
  customAlbumCover?: string;
  totalDuration: number;
  isPublic: boolean;
  createdAt: Date;
}

interface IArtistImage {
  height?: number;
  url: string;
  width?: number;
}

interface IArtist {
  _id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: {
    href?: string;
    total: number;
  };
  images: IArtistImage[];
  external_urls: {
    spotify: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type {
  IUser,
  IAlbum,
  ITrack,
  IPlaylistTrack,
  IPlaylist,
  IArtistImage,
  IArtist,
};
