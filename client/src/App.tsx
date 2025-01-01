import Navbar from "./components/Navbar";
import Player from "./components/Player";
import { Sidebar } from "./components/Sidebar";

const App = () => {
  return (
    <>
      <div className="h-screen bg-black">
        {/*אולי flex*/}
        <div className="h-[90%]">
          <Navbar />
          <Sidebar />
        </div>
        <Player />
      </div>
    </>
  );
};

export default App;
