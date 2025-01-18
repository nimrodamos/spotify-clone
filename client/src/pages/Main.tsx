// import Display from "@/components/Display";
// import { Sidebar } from "@/components/Sidebar/Sidebar";
// import RightSidebar from "@/components/RightSidebar/RightSidebar";
// import { useAppData } from "@/Context/AppDataContext";

// function Main() {
//   const { isRsbOpen } = useAppData();

//   // Dynamically calculate the display width
//   const displayWidth = isRsbOpen ? "w-[77.1%]" : "w-[81.4%]";

//   return (
//     <div className="flex overflow-hidden mx-2 h-[98%]">
//       <Sidebar />
//       {/* Apply dynamic width */}
      
//       <div className={`rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar transition-all duration-300 ${displayWidth}`}>
//         <Display />
//       </div>
//       <RightSidebar />
//     </div>
//   );
// }

// export default Main;
import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { useAppData } from "@/Context/AppDataContext";

function Main() {
  const { 
    isRsbOpen, 
    isLsbOpen, 
    lsbWidth,
    rsbWidth 
  } = useAppData();

  return (
    <div className="h-full p-2">
      <div className="grid h-full gap-2" 
        style={{
          gridTemplateColumns: isLsbOpen 
            ? `${lsbWidth}px minmax(0, 1fr) ${isRsbOpen ? `${rsbWidth}px` : '0fr'}`
            : `72px minmax(0, 1fr) ${isRsbOpen ? `${rsbWidth}px` : '0fr'}`,
        }}>
        {/* Left Sidebar */}
        <div className="h-full bg-[#121212] rounded-lg transition-all duration-300 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <Sidebar />
          </div>
        </div>

        {/* Main Display */}
        <div className="h-full bg-[#121212] rounded-lg overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar display-container">
            <Display />
          </div>
        </div>

        {/* Right Sidebar */}
        {isRsbOpen && (
          <div className="h-full bg-[#121212] rounded-lg transition-all duration-300 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <RightSidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Main;