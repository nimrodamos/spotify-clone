import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { useAppData } from "@/Context/AppDataContext";

function Main() {
  const { 
    isLsbOpen, 
    lsbWidth,
    rsbWidth 
  } = useAppData();

  return (
    <div className="h-full p-2">
      <div 
        className="grid h-full gap-2 transition-all duration-300"
        style={{
          gridTemplateColumns: isLsbOpen 
            ? `${lsbWidth}px minmax(0, 1fr) ${rsbWidth}px`
            : `72px minmax(0, 1fr) ${rsbWidth}px`,
        }}
      >
        {/* Left Sidebar */}
        <div className="h-full bg-[#121212] rounded transition-all duration-300 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <Sidebar />
          </div>
        </div>

        {/* Main Display */}
        <div className="h-full bg-[#121212] rounded overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar display-container">
            <Display />
          </div>
        </div>

        {/* Right Sidebar - Always Rendered */}
        <div className="h-full bg-[#121212] rounded transition-all duration-300 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
