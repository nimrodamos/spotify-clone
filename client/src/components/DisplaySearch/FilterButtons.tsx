import React from "react";

const FilterButtons: React.FC<{
    currentFilter: string;
    setCurrentFilter: React.Dispatch<React.SetStateAction<string>>;
}> = ({ currentFilter, setCurrentFilter }) => (
    <div className="flex gap-4 flex-wrap mb-1">
        {["All", "Artists", "Songs", "Playlists", "Albums", "Profiles", "Podcasts & Shows"].map(
            (filter) => (
                <button
                    key={filter}
                    onClick={() => setCurrentFilter(filter)}
                    className={`py-1 px-3 rounded-full transition ${
                        currentFilter === filter
                            ? "bg-[#ffff] text-black"
                            : "bg-[#181818] text-white hover:bg-[#282828]"
                    }`}
                >
                    {filter}
                </button>
            )
        )}
    </div>
);

export default FilterButtons;
