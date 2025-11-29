import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppContext } from "../Context/AppContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAppContext();

  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-linear-to-r from-indigo-700 to-violet-500 transition-all">
      <Link to="/" className="text-white font-semibold text-lg">
        FORM BUILDER
      </Link>

      <div className="hidden md:flex items-center gap-8 text-white">
        <Link
          to="/my-forms"
          className="cursor-pointer hover:underline transition-all"
        >
          My Forms
        </Link>
        <button
          onClick={logout}
          type="button"
          className="bg-white cursor-pointer text-gray-700 text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
        >
          Logout
        </button>
      </div>

      <button
        onClick={() => setIsMenuOpen((p) => !p)}
        aria-label="menu-btn"
        type="button"
        className="inline-block cursor-pointer md:hidden text-white text-2xl active:scale-90 transition"
      >
        <RxHamburgerMenu />
      </button>

      <div
        className={`fixed top-[70px] left-0 w-full h-screen p-6 bg-linear-to-r from-indigo-700 to-violet-500 text-white flex flex-col md:hidden items-center gap-6 font-medium transition-transform duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-center space-y-6 text-lg">
          <li>
            <Link to="/create" onClick={() => setIsMenuOpen(false)}>
              Create
            </Link>
          </li>
        </ul>

        <button
          onClick={() => {
            logout();
            setIsMenuOpen(false);
          }}
          type="button"
          className="bg-white text-gray-700 mt-6 text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
