import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { useAppData } from "@/Context/AppDataContext";

function Main() {
  const { isRsbOpen } = useAppData();

  // Dynamically calculate the display width
  const displayWidth = isRsbOpen ? "w-[77.1%]" : "w-[81.4%]";

  return (
    <div className="flex overflow-hidden mx-2 h-[98%]">
      <Sidebar />
      {/* Apply dynamic width */}
      
      <div className={`rounded bg-[#121212] text-white overflow-y-auto custom-scrollbar transition-all duration-300 ${displayWidth}`}>
        <Display />
      </div>
      <RightSidebar />
    </div>
  );
}

export default Main;
