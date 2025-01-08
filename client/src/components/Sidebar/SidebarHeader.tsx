import { assets } from "../../assets/assets.ts";
import { useUserContext } from "../../Context/UserContext.tsx";

export const SidebarHeader = () => {
    const { user } = useUserContext();

    return (
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img className="w-6 ml-2 mb-3" src={assets.stack_icon} alt="" />
                <p className="font-semibold">Your Library</p>
            </div>
            <div className="flex items-center gap-3">
                <img className="w-4 mr-2" src={assets.plus_icon} alt="" />
                {user && <img className="w-5" src={assets.arrow_icon} alt="" />}
            </div>
        </div>
    );
};
