import { RiSpotifyFill } from "react-icons/ri";
import { assets } from "../assets/assets";
import { GrInstallOption } from "react-icons/gr";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function Navbar() {
  return (
    <div className="w-full flex justify-between items-center font-semibold">
      <div className="flex items-center gap-2">
        <RiSpotifyFill color="white" size={"50px"} />
      </div>

      <div className="flex items-center gap-2">
        <img className="w-8" src={assets.home_icon} alt="" />
        <img className="w-8" src={assets.search_icon} alt="" />
      </div>

      <div className="flex items-center gap-4">
        <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer">
          explore premium
        </p>
        <p className="flex items-center bg-black text-white text-[15px] px-3 py-1 rounded-2xl cursor-pointer gap-2">
          <GrInstallOption color="white" />
          InstallApp
        </p>
        <Avatar className="w-12 h-12 rounded-full">
          <AvatarImage
            src="https://github.com/shadcn.png"
            className="w-full h-full rounded-full"
          />
          <AvatarFallback className="text-lg flex items-center justify-center w-full h-full rounded-full">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Navbar;
