import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDb.js";
import userRoutes from "./routes/userRoute.js";
import PlaylistRoutes from "./routes/playlistRoute.js";
import apiCallsRoutes from "./routes/apiCallsRoute.js";
import dbAlbumRoutes from "./routes/dbAlbumRoute.js";
import dbTrackRoutes from "./routes/dbTrackRoute.js";
import dbArtistRoutes from "./routes/dbArtistRoute.js";
import path from "path";
import cloudinary from "cloudinary";
import cors from "cors";
import https from "https";
import fs from "fs";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const frontendPath = path.join(__dirname, "../../frontend/dist");

const server = https.createServer({
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
}, app);

server.listen(PORT, () => {
  console.log(`Secure server running at https://localhost:${PORT}`);
});
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(frontendPath));
app.use(
  cors({
    origin: "https://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,
  })
);
app.use("/api/users", userRoutes);
app.use("/api/playlists", PlaylistRoutes);
app.use("/api/albums", dbAlbumRoutes);
app.use("/api/tracks", dbTrackRoutes);
app.use("/api/artists", dbArtistRoutes);
app.use("/api/", apiCallsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

