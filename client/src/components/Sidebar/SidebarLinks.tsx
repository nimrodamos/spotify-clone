import { Link } from "react-router-dom";

export const SidebarLinks = () => (
    <div>
        <div className="flex flex-wrap gap-6 text-xs mt-12 ml-6  font-medium text-currentColor">
            <Link to="/legal">Legal</Link>
            <Link to="/safetyandprivacy">Safety & Privacy Center</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/cookies-policy">Cookies</Link>
            <Link to="/privacy-policy">About Ads</Link>
            <Link to="/accessibility">Accessibility</Link>
        </div>
        <div className="ml-6 mt-2 text-xs font-medium text-textBase hover:underline">
            <Link to="/cookies-policy">Cookies</Link>
        </div>
    </div>
);
