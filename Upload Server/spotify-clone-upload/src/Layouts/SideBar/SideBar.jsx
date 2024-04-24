import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-screen bg-black h-[70px] p-[10px] flex items-center">
      <div className="flex-1">
        <h1 className="text-[20px] ml-[20px]">Spotify For Artists</h1>
      </div>

      <div className="min-w-[200px] flex items-center justify-center mr-[10px]">
        <ul className="flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-[#3bff3b] mx-[25px]" : "mx-[25px]"
            }
          >
            <div>HOME</div>
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? "text-[#3bff3b] mx-[25px]" : "mx-[25px]"
            }
          >
            <div>MY UPLOADS</div>
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? "text-[#3bff3b] mx-[25px]" : "mx-[25px]"
            }
          >
            <div>ACCOUNT</div>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
