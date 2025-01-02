import Display from "@/components/Display";
import { Sidebar } from "@/components/Sidebar";

function Main() {
  return (
    <div className="flex overflow-hidden h-[90%] ">
      <Sidebar />
      <Display />
    </div>
  );
}

export default Main;
