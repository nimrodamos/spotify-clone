import React from "react";
import Logo from "./Logo";
import UserActions from "./UserActions";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between pt-1 bg-black ">
      <Logo />
      <SearchBar />
      <UserActions />
    </nav>
  );
};

export default Navbar;
