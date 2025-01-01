import { RiSpotifyFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { GrInstallOption } from "react-icons/gr";

function Navbar() {
  return (
    <div className="w-full flex justify-between items-center font-semibold">
      <div className="flex items-center gap-2">
        <RiSpotifyFill color="white" size={"50px"} />
        <img className="w-6" src={assets.home_icon} alt="" />
        <img className="w-6" src={assets.search_icon} alt="" />
      </div>

      <div className="flex items-center gap-4">
        <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
          explore premium
        </p>

        <p className="flex items-center bg-black text-white text-[15px] px-3 py-1 rounded-2xl cursor-pointer gap-2">
          <GrInstallOption color="white" />
          InstallApp
        </p>
      </div>
    </div>
  );
}

export default Navbar;
