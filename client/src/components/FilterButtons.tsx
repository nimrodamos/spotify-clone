import React from "react";

interface FilterButtonsProps {
  filter: "all" | "music" | "podcasts";
  setFilter: (filter: "all" | "music" | "podcasts") => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ filter, setFilter }) => (
  <div className="flex gap-2 sticky top-0 z-10 bg-[#1b1b1b] px-12 py-4 text-white">
    {["all", "music", "podcasts"].map((type) => (
      <button
        key={type}
        className={`py-1 px-4  rounded-full ${
          filter === type ? "bg-white text-black" : "bg-[#2b2929] text-white"
        }`}
        onClick={() => setFilter(type as "all" | "music" | "podcasts")}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);

export default FilterButtons;
