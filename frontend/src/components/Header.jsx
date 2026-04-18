import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-200">

      {/* LOGO */}
      <p className="text-lg font-semibold text-white tracking-wide">
        Blog
      </p>

      {/* NAV LINKS */}
      <ul className="flex gap-6 text-sm text-gray-400">
        
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-white font-medium" : "hover:text-gray-300"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "text-white font-medium" : "hover:text-gray-300"
            }
          >
            Register
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "text-white font-medium" : "hover:text-gray-300"
            }
          >
            Login
          </NavLink>
        </li>

      </ul>
    </nav>
  );
}

export default Header;