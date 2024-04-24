import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { signOut } from "../utils/userAccount";
import {
  readOnceFromDatabase,
  read_OneValue_from_Database,
} from "../utils/firebaseCRUD";
import { auth } from "../utils/firebase";
import { set } from "firebase/database";

const Home = (props) => {
  const [userName, setUserName] = useState(props.user.displayName);

  useEffect(() => {
    read_OneValue_from_Database(
      "Users/" + auth.currentUser.uid + "/Name",
      (data) => {
        setUserName(data);
      }
    );
  }, []);

  return (
    <div className="my-[15px] mt-[40px] mx-[5px] mr-[20px] rounded-[10px] bg-[#131313] w-full relative mainHeight">
      <div className="absolute right-0 top-0 m-[10px] flex">
        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[10px]">
          <FaRegBell />
        </div>

        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[10px]">
          <MdGroups2 className="w-[20px] h-[20px]" />
        </div>

        <div
          className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px] cursor-pointer"
          onClick={(event) => {
            signOut();
            props.setUser(null);
          }}
        >
          {userName != null ? <h1 className="text-[13px]">{userName[0].toUpperCase()}</h1> : <FaUser />}
        </div>
      </div>

      <div className="flex items-center m-[10px] mt-[15px]">
        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px] rotate-180 cursor-pointer">
          <GrNext className="w-[20px] h-[20px]" />
        </div>

        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px] cursor-pointer">
          <GrNext className="w-[20px] h-[20px]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
