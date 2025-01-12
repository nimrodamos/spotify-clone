import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const InfoPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={popupRef} className="absolute top-12 left-0 bg-gradient-to-r from-blue-400 to-blue-500 text-black p-4 rounded-md shadow-lg w-90 animate-slide-in-left before:content-[''] before:absolute before:right-full before:mt-12 before:border-8 before:border-transparent before:border-r-blue-500 z-50">
            <h3 className="font-bold text-lg">Create a playlist</h3>
            <p className="text-sm my-2">Log in to create and share playlists</p>
            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="text-black bg-transparent hover:scale-[1.04] z-100 font-bold text-sm"
                    onClick={onClose}
                >
                    Not now
                </button>
                <Link
                    to="/login"
                    className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform"
                >
                    Log in
                </Link>
            </div>
        </div>
    );
};

export default InfoPopup;