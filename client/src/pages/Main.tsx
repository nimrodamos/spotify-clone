import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar/Sidebar";

function Main() {
  return (
    <div className="flex overflow-hidden mx-2 h-[98%] ">
      <Sidebar />
      <Display />
    </div>
  );
}

export default Main;
