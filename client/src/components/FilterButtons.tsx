import React from "react";

interface FilterButtonsProps {
  filter: "all" | "music" | "podcast";
  setFilter: (filter: "all" | "music" | "podcast") => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ filter, setFilter }) => (
  <div className="flex gap-2 sticky top-0 z-10 bg-[rgba(0,0,0,0.6)] py-4">
    {["all", "music", "podcast"].map((type) => (
      <button
        key={type}
        className={`py-1 px-4  rounded-full ${
          filter === type ? "bg-white text-black" : "bg-gray-700 text-gray-300"
        }`}
        onClick={() => setFilter(type as "all" | "music" | "podcast")}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);

export default FilterButtons;
