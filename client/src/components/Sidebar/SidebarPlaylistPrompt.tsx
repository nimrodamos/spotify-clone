import { useState } from "react";
import InfoPopup from "./InfoPopup.tsx";
import { useUserContext } from "@/Context/UserContext";
import axios from "axios";

export const SidebarPlaylistPrompt = () => {
    const user = useUserContext();
    const [showPopup, setShowPopup] = useState(false);

    const handleCreatePlaylistClick = async () => {
        if (!user.user) {
            setShowPopup(true);
        } else {
            try {
                const response = await axios.get('/api/playlists');
                const playlists = response.data;
                const newPlaylistName = `My Playlist #${playlists.length + 1}`;
                await axios.post('/api/playlists', { name: newPlaylistName });
                // Optionally, you can update the state or provide feedback to the user here
            } catch (error) {
                console.error("Error creating playlist:", error);
            }
        }
    };

    return (
        <div className="p-4 bg-backgroundHighlight m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 relative">
            <h1>Create your first playlist</h1>
            <p className="font-light">It's easy, we'll help you</p>
            <button
                className="px-4 py-1.5 bg-textBase text-[15px] text-black rounded-full mt-4 hover:scale-[1.04]"
                onClick={handleCreatePlaylistClick}
            >
                Create playlist
            </button>
            {showPopup && <InfoPopup onClose={() => setShowPopup(false)} />}
        </div>
    );
};
