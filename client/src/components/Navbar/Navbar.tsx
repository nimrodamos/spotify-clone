import React from "react";
import Logo from "./Logo";
import UserActions from "./UserActions";
import SearchBar from "./SearchBar";

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-black p-1">
      <Logo />
      <SearchBar />
      <UserActions />
    </nav>
  );
};

export default Navbar;
