
// import React from "react";
// import { useAppData } from "@/Context/AppDataContext";
// import SongSidebar from "./SongSidebar";
// import QueueSidebar from "./QueueSidebar";

// const RightSidebar: React.FC = () => {
//   const { 
//     isRsbOpen, 
//     rsbMode, 
//     setRsbWidth,
//     isResizingRsb,
//     setIsResizingRsb
//   } = useAppData();

//   React.useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isResizingRsb) {
//         const windowWidth = window.innerWidth;
//         const newWidth = windowWidth - e.clientX;
//         if (newWidth >= 280 && newWidth <= 420) {
//           setRsbWidth(newWidth);
//         }
//       }
//     };

//     const handleMouseUp = () => {
//       setIsResizingRsb(false);
//       document.body.style.cursor = 'default';
//     };

//     if (isResizingRsb) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//       document.body.style.cursor = 'col-resize';
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.body.style.cursor = 'default';
//     };
//   }, [isResizingRsb]);

//   if (!isRsbOpen) return null;

//   return (
//     <div className="h-full flex relative overflow-hidden">
//       {/* Resize handle */}
//       <div
//         className="absolute left-0 top-0 w-1 h-full hover:bg-[#ffffff30] cursor-col-resize z-50"
//         onMouseDown={(e) => {
//           e.preventDefault();
//           setIsResizingRsb(true);
//         }}
//       />
//       {/* Content Container */}
//       <div className="flex-1 h-full overflow-hidden">
//         <div className="h-full overflow-y-auto no-scrollbar">
//           {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

//!/

// import React from "react";
// import { useAppData } from "@/Context/AppDataContext";
// import SongSidebar from "./SongSidebar";
// import QueueSidebar from "./QueueSidebar";

// const RightSidebar: React.FC = () => {
//   const { 
//     isRsbOpen, 
//     rsbMode, 
//     rsbWidth, // Added this
//     setRsbWidth,
//     isResizingRsb,
//     setIsResizingRsb
//   } = useAppData();

//   React.useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (isResizingRsb) {
//         const windowWidth = window.innerWidth;
//         const newWidth = windowWidth - e.clientX;
//         if (newWidth >= 280 && newWidth <= 420) {
//           setRsbWidth(newWidth);
//         }
//       }
//     };

//     const handleMouseUp = () => {
//       setIsResizingRsb(false);
//       document.body.style.cursor = 'default';
//     };

//     if (isResizingRsb) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//       document.body.style.cursor = 'col-resize';
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.body.style.cursor = 'default';
//     };
//   }, [isResizingRsb]);

//   // Remove the conditional rendering and dynamically adjust width
//   return (
//     <div 
//       className="h-full flex relative overflow-hidden"
//       style={{ width: rsbWidth }} // Dynamic width
//     >
//       {/* Resize handle */}
//       <div
//         className="absolute left-0 top-0 w-1 h-full hover:bg-[#ffffff30] cursor-col-resize z-50"
//         onMouseDown={(e) => {
//           e.preventDefault();
//           setIsResizingRsb(true);
//         }}
//       />
//       {/* Content Container */}
//       <div className="flex-1 h-full overflow-hidden">
//         <div className="h-full overflow-y-auto no-scrollbar">
//           {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

//?

// import React from "react";
// import { useAppData } from "@/Context/AppDataContext";
// import SongSidebar from "./SongSidebar";
// import QueueSidebar from "./QueueSidebar";
// import { SIDEBAR_CONSTRAINTS } from "@/Context/AppDataContext";

// const RightSidebar: React.FC = () => {
//   const { 
//     isRsbOpen, 
//     rsbMode, 
//     rsbWidth,
//     setRsbWidth,
//     isResizingRsb,
//     setIsResizingRsb
//   } = useAppData();

//   const [isHovering, setIsHovering] = React.useState(false);

//   React.useEffect(() => {
//       const handleMouseMove = (e: MouseEvent) => {
//         if (isResizingRsb) {
//           const windowWidth = window.innerWidth; 
//           const newWidth = windowWidth - e.clientX;
//           if (newWidth >= 280 && newWidth <= 420) {
//             setRsbWidth(newWidth);
//           }
//         }
//       };
  
//       const handleMouseUp = () => {
//         setIsResizingRsb(false);
//         document.body.style.cursor = 'default';
//       };
  
//       if (isResizingRsb) {
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
//         document.body.style.cursor = 'col-resize';
//       }
  
//       return () => {
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);
//         document.body.style.cursor = 'default';
//       };
//     }, [isResizingRsb]);
//   const handleMouseEnter = () => {
//     if (!isRsbOpen) {
//       setIsHovering(true);
//       setRsbWidth(SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH + 10);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (!isRsbOpen) {
//       setIsHovering(false);
//       setRsbWidth(SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH);
//     }
//   };


//   return (
//     <div 
//       className="h-full flex relative overflow-hidden"
//       style={{ width: rsbWidth }}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Resize handle */}
//       <div
//         className="absolute left-0 top-0 w-1 h-full hover:bg-[#ffffff30] cursor-col-resize z-50"
//         onMouseDown={(e) => {
//           e.preventDefault();
//           setIsResizingRsb(true);
//         }}
//       />

//       {/* Content Container */}
//       <div className="flex-1 h-full overflow-hidden relative">
//         {/* Collapsed state overlay */}
//         {!isRsbOpen && (
//           <div 
//             className="absolute inset-0 bg-[#121212]"
//             style={{ opacity: isHovering ? 0.5 : 1 }}
//           />
//         )}
        
//         <div className="h-full overflow-y-auto no-scrollbar">
//           {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

import React from "react";
import { useAppData } from "@/Context/AppDataContext";
import SongSidebar from "./SongSidebar";
import QueueSidebar from "./QueueSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { SIDEBAR_CONSTRAINTS } from "@/Context/AppDataContext";

const RightSidebar: React.FC = () => {
  const { 
    isRsbOpen, 
    rsbMode, 
    rsbWidth,
    setRsbWidth,
    isResizingRsb,
    setIsResizingRsb,
    setIsRsbOpen
  } = useAppData();

  const [isHovering, setIsHovering] = React.useState(false);

  // Handle resize logic
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRsb) {
        const windowWidth = window.innerWidth;
        const newWidth = windowWidth - e.clientX;
        setRsbWidth(Math.max(
          SIDEBAR_CONSTRAINTS.MIN_WIDTH,
          Math.min(newWidth, SIDEBAR_CONSTRAINTS.MAX_WIDTH)
        ));
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
    };
  }, [isResizingRsb]);

  const handleMouseEnter = () => {
    if (!isRsbOpen) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isRsbOpen) {
      setIsHovering(false);
    }
  };

  const handleCollapsedClick = () => {
    if (!isRsbOpen) {
      setRsbWidth(SIDEBAR_CONSTRAINTS.MIN_WIDTH);
      setIsRsbOpen(true);
    }
  };

  return (
    <motion.div 
      className="h-full relative overflow-hidden"
      initial={{ width: SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH }}
      animate={{ 
        width: isRsbOpen ? rsbWidth : SIDEBAR_CONSTRAINTS.RSB_COLLAPSED_WIDTH 
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
        <AnimatePresence mode="wait">
          <motion.div 
            key={isRsbOpen ? "open" : "closed"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full relative"
          >
            {isRsbOpen ? (
              <div className="h-full overflow-y-auto no-scrollbar">
                {rsbMode === "queue" ? <QueueSidebar /> : <SongSidebar />}
              </div>
            ) : (
              <div 
                className={`h-full cursor-pointer transition-all duration-200 ${
                  isHovering ? 'bg-[#1B1B1B]' : 'bg-[#121212]'
                }`}
                onClick={handleCollapsedClick}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RightSidebar;