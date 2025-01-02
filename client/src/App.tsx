import Navbar from "./components/Navbar";
import Player from "./components/Player";
import Main from "./pages/Main";

const App = () => {
  return (
    <>
      <div className="h-screen bg-black">
        <div className="h-[90%]">
          <Navbar />
          <Main />
        </div>
        <div className="h-[10%]">
          <Player />
        </div>
      </div>
    </>
  );
};

export default App;
