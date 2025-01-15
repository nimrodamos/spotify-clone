import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { useAppData } from "@/Context/AppDataContext";

function Main() {
  const { isRsbOpen } = useAppData();
  return (
    <div className="flex overflow-hidden mx-2 h-[98%]">
      <Sidebar />
      <Display isRsbOpen={isRsbOpen} />
      <RightSidebar/>
    </div>
  );
}

export default Main;
