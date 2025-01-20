// import React from "react";
// import { useAppData } from "@/Context/AppDataContext";
// import SongSidebar from "./SongSidebar";
// import QueueSidebar from "./QueueSidebar";

// const RightSidebar: React.FC = () => {
//   const { isRsbOpen, rsbMode } = useAppData();

//   return (
//     <>
//       {isRsbOpen && (
//         <div
//           className="fixed top-[76px] right-0 h-[79.7%] bg-[#111213] text-white shadow-lg z-40"
//           style={{ width: "285px" }}
//         >
//           {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
//         </div>
//       )}
//     </>
//   );
// };

// export default RightSidebar;
import React from "react";
import { useAppData } from "@/Context/AppDataContext";
import SongSidebar from "./SongSidebar";
import QueueSidebar from "./QueueSidebar";

const RightSidebar: React.FC = () => {
  const { 
    isRsbOpen, 
    rsbMode, 
    setRsbWidth,
    isResizingRsb,
    setIsResizingRsb
  } = useAppData();

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRsb) {
        const windowWidth = window.innerWidth;
        const newWidth = windowWidth - e.clientX;
        if (newWidth >= 280 && newWidth <= 420) {
          setRsbWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingRsb(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingRsb) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizingRsb]);

  if (!isRsbOpen) return null;

  return (
    <div className="h-full flex relative overflow-hidden">
      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 w-1 h-full hover:bg-[#ffffff30] cursor-col-resize z-50"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizingRsb(true);
        }}
      />
      {/* Content Container */}
      <div className="flex-1 h-full overflow-hidden">
        <div className="h-full overflow-y-auto no-scrollbar">
          {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;