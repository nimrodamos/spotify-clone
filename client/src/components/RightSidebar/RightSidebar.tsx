import React from "react";
import { useAppData } from "@/Context/AppDataContext";
import SongSidebar from "./SongSidebar";
import QueueSidebar from "./QueueSidebar";

const RightSidebar: React.FC = () => {
  const { isRsbOpen, rsbMode } = useAppData();

  return (
    <>
      {isRsbOpen && (
        <div
          className="fixed top-[76px] right-0 h-[79.7%] bg-[#111213] text-white shadow-lg z-40"
          style={{ width: "285px" }}
        >
          {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
        </div>
      )}
    </>
  );
};

export default RightSidebar;
