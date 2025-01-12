import React from "react";
import { RiSpotifyFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center">
            <RiSpotifyFill
                title="spotify"
                color="white"
                size={38}
                className="cursor-pointer ml-5"
                onClick={() => navigate("/")}
            />
        </div>
    );
};

export default Logo;
