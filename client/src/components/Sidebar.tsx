import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

export const Sidebar = () => {
  return (
    <div className="w-[25%] h-full flex-col mr-2 gap-2 text-textBase hidden lg:flex">
      <div className="bg-backgroundBase h-[100%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex item-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex item-center gap-3">
            <img className="w-5" src={assets.plus_icon} alt="" />
            <img className="w-5" src={assets.arrow_icon} alt="" />
          </div>
        </div>
        <div className="p-4 bg-backgroundHighlight m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
          <h1>Create your first playlist</h1>
          <p className="font-light">it's easy, we'll help you</p>
          <button className="px-4 py-1.5 bg-textBase text-[15px] text-black rounded-full mt-4">
            Create playlist
          </button>
        </div>
        <div className="p-4 bg-backgroundHighlight m-2 rounded font-semibold flex flex-col   items-start justify-start gap-1 pl-4 mt-4">
          <h1>Let's find some podcasts to follow</h1>
          <p className="font-light">We'll keep you updated on new episodes</p>
          <button className="px-4 py-1.5 bg-textBase text-[15px] text-black rounded-full mt-4">
            Browse podcasts
          </button>
        </div>
        <div className="flex flex-wrap gap-[1rem] text-[11px] mt-[3rem] ml-6 font-medium text-currentColor">
          <Link to="/legal">Legal</Link>
          <Link to="/safteyandprivacy">Saftey & Privacy Center</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/cookies-policy">Cookies</Link>
          <Link to="/privacy-policy">About Ads</Link>
          <Link to="/accessabillity">Accessabillity</Link>
        </div>
        <div className="ml-6 mt-2 text-[11px] font-medium text-currentColor">
          <Link to="cookies-policy" className="text-xs ">Cookies</Link>
        </div>
        <div>
        <button data-testid="language-selection-button" className="flex justify-center border-solid border-[1px] mt-9 ml-6 border-essentialSubdued text-textBase items-center px-3 py-[0.25rem] bg-transparent text-sm font-bold rounded-full">
          <span aria-hidden="true" className="mr-2">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" className="w-4 h-4" fill="white">
              <path d="M8.152 16H8a8 8 0 1 1 .152 0zm-.41-14.202c-.226.273-.463.713-.677 1.323-.369 1.055-.626 2.496-.687 4.129h3.547c-.06-1.633-.318-3.074-.687-4.129-.213-.61-.45-1.05-.676-1.323-.194-.235-.326-.285-.385-.296h-.044c-.055.007-.19.052-.391.296zM4.877 7.25c.062-1.771.34-3.386.773-4.624.099-.284.208-.554.329-.806a6.507 6.507 0 0 0-4.436 5.43h3.334zm-3.334 1.5a6.507 6.507 0 0 0 4.436 5.43 7.974 7.974 0 0 1-.33-.806c-.433-1.238-.71-2.853-.772-4.624H1.543zm4.835 0c.061 1.633.318 3.074.687 4.129.214.61.451 1.05.677 1.323.202.244.336.29.391.297l.044-.001c.06-.01.19-.061.385-.296.226-.273.463-.713.676-1.323.37-1.055.626-2.496.687-4.129H6.378zm5.048 0c-.061 1.771-.339 3.386-.772 4.624-.082.235-.171.46-.268.674a6.506 6.506 0 0 0 4.071-5.298h-3.03zm3.031-1.5a6.507 6.507 0 0 0-4.071-5.298c.097.214.186.44.268.674.433 1.238.711 2.853.772 4.624h3.031z"></path>
            </svg>
          </span>
            English 
        </button>
        </div>
      </div>
    </div>
  );
};
