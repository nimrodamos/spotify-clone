import React from 'react';

const DisplayLyrics: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-[90vh] text-white p-[20px] bg-[#333333]">
            <h1 className="text-[4.5rem] mx-[150px] font-bold font-sans">
            Looks like we don't have the lyrics for this song.
            </h1>
        </div>
    );
};

export default DisplayLyrics;
