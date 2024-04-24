import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { IoLibrarySharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[300px] bg-[#030303] flex-shrink-0 flex flex-col h-screen">
      {/* <div className="flex items-center mt-[30px] ml-[15px] flex-shrink-0">
        <div className="min-w-[5px] min-h-[5px] bg-white rounded-[50%] mx-[3px]"></div>
        <div className="min-w-[5px] min-h-[5px] bg-white rounded-[50%] mx-[3px]"></div>
        <div className="min-w-[5px] min-h-[5px] bg-white rounded-[50%] mx-[3px]"></div>
      </div> */}

      <div className="h-screen">
        <div className="w-[90%] bg-[#131313] rounded-[10px] py-[15px] px-[15px] m-auto mt-[40px]">
          <ul>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-[#ffffff]" : "text-[#A7A7A7]"
              }
            >
              <div className="flex items-center">
                <MdHomeFilled className="w-[22px] h-[22px]" />
                <h1 className="ml-[20px] text-[15px] font-thin">Home</h1>
              </div>
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) =>
                isActive ? "text-[#ffffff]" : "text-[#A7A7A7]"
              }
            >
              <div className="mt-[20px] flex items-center">
                <IoSearchOutline className="w-[22px] h-[22px]" />
                <h1 className="ml-[20px] text-[15px] font-thin">Search</h1>
              </div>
            </NavLink>
          </ul>
        </div>

        <div className="w-[90%] bg-[#131313] rounded-[10px] py-[15px] px-[15px] m-auto mt-[10px] flex-1 sidebarHeight">
          <div className="flex items-center relative">
            <IoLibrarySharp className="w-[22px] h-[22px]" />
            <h1 className="ml-[20px] text-[15px] font-thin">Your Library</h1>
            <div className="absolute right-0 flex items-center">
              <FaPlus className="mr-[14px]" />
              <GrLinkNext className="w-[20x] h-[20px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
