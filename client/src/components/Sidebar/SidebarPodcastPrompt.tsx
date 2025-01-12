import { Link } from "react-router-dom";

export const SidebarPodcastPrompt = () => (
    <div className="p-4 bg-backgroundHighlight m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
        <h1>Let's find some podcasts to follow</h1>
        <p className="font-light">We'll keep you updated on new episodes</p>
        <button className="px-4 py-1.5 bg-textBase text-[15px] text-black rounded-full mt-4 hover:scale-[1.04]">
            <Link to={"/podcasts"}>
                Browse podcasts
            </Link>
        </button>
    </div>
);
