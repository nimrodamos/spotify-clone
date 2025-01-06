import mongoose from 'mongoose';
import axios from 'axios';
import Artist from '../models/artistModel.js'; // Adjust the path as necessary
import fetchAppAccessToken from '../controllers/apiCallsController.js';
import connectDB from './connectDb.js'; // Adjust the path as necessary
import Album from '../models/albumModel.js'; // Adjust the path as necessary

// const artists = [
//     'Adele', 'Beyoncé', 'Drake', 'Ed Sheeran', 'Taylor Swift', 'The Weeknd', 'Billie Eilish', 'Bruno Mars', 'Kanye West', 'Rihanna',
//     'Justin Bieber', 'Ariana Grande', 'Post Malone', 'Shawn Mendes', 'Dua Lipa', 'Harry Styles', 'Katy Perry', 'Lady Gaga', 'Maroon 5', 'Sam Smith',
//     'Selena Gomez', 'Travis Scott', 'Cardi B', 'Khalid', 'Halsey', 'Imagine Dragons', 'Lizzo', 'Camila Cabello', 'Lil Nas X', 'Miley Cyrus',
//     'Nicki Minaj', 'Sia', 'Zayn', 'Lana Del Rey', 'Doja Cat', 'J Balvin', 'Bad Bunny', 'Rosalía', 'Shakira', 'Maluma',
//     'Ozuna', 'Daddy Yankee', 'Anuel AA', 'Karol G', 'Becky G', 'Natti Natasha', 'Luis Fonsi', 'Enrique Iglesias', 'Pitbull', 'J. Cole',
//     'Kendrick Lamar', 'Lil Wayne', 'Future', '21 Savage', 'Meek Mill', 'Young Thug', 'Trippie Redd', 'Juice WRLD', 'Lil Uzi Vert', 'DaBaby',
//     'Roddy Ricch', 'Lil Baby', 'Gunna', 'Pop Smoke', 'NAV', 'Tyga', 'Offset', 'Quavo', 'Takeoff', 'Lil Yachty',
//     'Playboi Carti', 'Travis Barker', 'Machine Gun Kelly', 'Yungblud', 'Blackbear', 'Bazzi', 'Bryson Tiller', 'Frank Ocean', 'The Chainsmokers', 'Marshmello',
//     'Zedd', 'Kygo', 'Calvin Harris', 'David Guetta', 'Martin Garrix', 'Avicii', 'Deadmau5', 'Skrillex', 'Diplo', 'Major Lazer',
//     'DJ Snake', 'Tiesto', 'Armin van Buuren', 'Afrojack', 'Steve Aoki', 'Hardwell', 'Kaskade', 'Porter Robinson', 'Madeon', 'Illenium',
//     'Seven Lions', 'Gryffin', 'San Holo', 'RL Grime', 'Flume', 'Louis The Child', 'NGHTMRE', 'Said The Sky', 'Ekali', 'Jai Wolf',
//     'What So Not', 'REZZ', 'ZHU', 'Getter', 'JOYRYDE', 'Kayzo', 'Jauz', 'Slushii', 'Boombox Cartel', 'Crankdat',
//     'Whethan', 'Medasin', 'Pluko', 'Manila Killa', 'Hotel Garuda', 'Autograf', 'Big Wild', 'Kasbo', 'Petit Biscuit', 'Shallou',
//     'Yotto', 'Lane 8', 'Ben Böhmer', 'Anjunadeep', 'ODESZA', 'RÜFÜS DU SOL', 'Bob Moses', 'Gorgon City', 'CamelPhat', 'Fisher',
//     'Chris Lake', 'Green Velvet', 'Carl Cox', 'Richie Hawtin', 'Adam Beyer', 'Charlotte de Witte', 'Amelie Lens', 'Nina Kraviz', 'Peggy Gou', 'Sven Väth',
//     'Paul Kalkbrenner', 'Jamie Jones', 'Marco Carola', 'Joseph Capriati', 'Luciano', 'Ricardo Villalobos', 'Paco Osuna', 'Hot Since 82', 'Patrick Topping',
//     'Omer Adam', 'Eden Ben Zaken', 'Static and Ben El', 'Noa Kirel', 'Ivri Lider', 'Eyal Golan', 'Sarit Hadad', 'Moshe Peretz', 'Shiri Maimon', 'Harel Skaat',
//     'Ninet Tayeb', 'Yehuda Poliker', 'Shlomi Shabat', 'Keren Peles', 'Idan Raichel', 'Miri Mesika', 'Rita', 'Boaz Sharabi', 'Yishai Ribo', 'Hanan Ben Ari',
//     'Aviv Geffen', 'Shalom Hanoch', 'Arik Einstein', 'Berry Sakharof', 'Ehud Banai', 'Yehudit Ravitz', 'Gidi Gov', 'Mashina', 'Teapacks', 'Hadag Nahash',
//     'Kaveret', 'Ethnix', 'Eifo HaYeled', 'Shlomo Artzi', 'Yoni Rechter', 'Matt Caseli', 'Jane Bordeaux', 'Tuna', 'Avraham Tal', 'Hatikva 6', 
//     'Cafe Shahor Hazak', 'Red Band', 'The Angelcy', 'A-WA', 'Tomer Yosef', 'Geva Alon', 'Eliad', 'Noga Erez', 'Lola Marsh'
// ];
// let SPOTIFY_ACCESS_TOKEN = '';
// const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
// const updateAccessToken = async () => {
//     SPOTIFY_ACCESS_TOKEN = await fetchAppAccessToken();
// };

// await updateAccessToken();
// async function fetchTracksByArtist(artist) {
//     try {
//         const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
//             headers: {
//                 Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`
//             },
//             params: {
//                 q: artist,
//                 type: 'track',
//                 limit: 20
//             }
//         });

//         return response.data.tracks.items;
//     } catch (error) {
//         console.error(`Error fetching tracks for artist ${artist}:`, error);
//         return [];
//     }
// }

// async function populateDb() {
//     await connectDB();

//     for (const artist of artists) {
//         const tracks = await fetchTracksByArtist(artist);

//         for (const track of tracks) {
//             const trackData = {
//                 spotifyTrackId: track.id,
//                 name: track.name,
//                 artist: track.artists.map(artist => artist.name).join(', '),
//                 album: track.album.name,
//                 albumCoverUrl: track.album.images[0]?.url || '',
//                 durationMs: track.duration_ms
//             };
//             try {
//                 const existingTrack = await Track.findOne({ spotifyTrackId: track.id });
//                 if (!existingTrack) {
//                     await Track.create(trackData);
//                     console.log(`Added track ${track.name} by ${trackData.artist} to the database.`);
//                 } else {
//                     console.log(`Track ${track.name} by ${trackData.artist} already exists in the database.`);
//                 }
//             } catch (error) {
//                 console.error(`Error processing track ${track.name}:`, error);
//             }
//         }
//     }

//     mongoose.connection.close();
// }

// populateDb().catch(error => {
//     console.error('Error populating the database:', error);
//     mongoose.connection.close();
// });

// async function fetchAlbumsByArtist(artist) {
//     try {
//         const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
//             headers: {
//                 Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`
//             },
//             params: {
//                 q: artist,
//                 type: 'album',
//                 limit: 20 // Set a high limit to fetch as many albums as possible
//             }
//         });

//         return response.data.albums.items;
//     } catch (error) {
//         console.error(`Error fetching albums for artist ${artist}:`, error);
//         return [];
//     }
// }

// async function populateAlbumsDb() {
//     await connectDB();

//     for (const artist of artists) {
//         const albums = await fetchAlbumsByArtist(artist);

//         for (const album of albums) {
//             const albumData = {
//                 spotifyAlbumId: album.id,
//                 name: album.name,
//                 artist: album.artists.map(artist => artist.name).join(', '),
//                 releaseDate: album.release_date,
//                 totalTracks: album.total_tracks,
//                 albumCoverUrl: album.images[0]?.url || '',
//                 spotifyUrl: album.external_urls.spotify
//             };
//             try {
//                 const existingAlbum = await Album.findOne({ spotifyAlbumId: album.id });
//                 if (!existingAlbum) {
//                     await Album.create(albumData);
//                     console.log(`Added album ${album.name} by ${albumData.artist} to the database.`);
//                 } else {
//                     console.log(`Album ${album.name} by ${albumData.artist} already exists in the database.`);
//                 }
//             } catch (error) {
//                 console.error(`Error processing album ${album.name}:`, error);
//             }
//         }
//     }

//     mongoose.connection.close();
// }

// populateAlbumsDb().catch(error => {
//     console.error('Error populating the albums database:', error);
//     mongoose.connection.close();
// });

// export default populateAlbumsDb;

// let SPOTIFY_ACCESS_TOKEN = '';
// const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// const updateAccessToken = async () => {
//     SPOTIFY_ACCESS_TOKEN = await fetchAppAccessToken();
// };

// await updateAccessToken();

// async function fetchArtistData(artist) {
//     try {
//         const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
//             headers: {
//                 Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`
//             },
//             params: {
//                 q: artist,
//                 type: 'artist',
//                 limit: 1
//             }
//         });

//         return response.data.artists.items[0];
//     } catch (error) {
//         console.error(`Error fetching data for artist ${artist}:`, error);
//         return null;
//     }
// }

// async function populateArtistsDb() {
//     await connectDB();

//     for (const artistName of artists) {
//         const artistData = await fetchArtistData(artistName);

//         if (artistData) {
//             const artist = {
//                 name: artistData.name,
//                 genres: artistData.genres,
//                 popularity: artistData.popularity,
//                 followers: {
//                     href: artistData.followers.href,
//                     total: artistData.followers.total
//                 },
//                 images: artistData.images.map(image => ({
//                     height: image.height,
//                     url: image.url,
//                     width: image.width
//                 })),
//                 external_urls: {
//                     spotify: artistData.external_urls.spotify
//                 }
//             };

//             try {
//                 const existingArtist = await Artist.findOne({ name: artistData.name });
//                 if (!existingArtist) {
//                     await Artist.create(artist);
//                     console.log(`Added artist ${artist.name} to the database.`);
//                 } else {
//                     console.log(`Artist ${artist.name} already exists in the database.`);
//                 }
//             } catch (error) {
//                 console.error(`Error processing artist ${artist.name}:`, error);
//             }
//         }
//     }

//     mongoose.connection.close();
// }

// populateArtistsDb().catch(error => {
//     console.error('Error populating the artists database:', error);
//     mongoose.connection.close();
// });

// export default populateArtistsDb;