import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { IoSearchOutline } from "react-icons/io5";
import {
  read_OneValue_from_Database,
  read_from_Database_onChange_query,
  updateDatabase,
} from "../utils/firebaseCRUD";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import Song from "../Components/Song";
import { auth } from "../utils/firebase";

const Search = (props) => {
  const [searchText, setSearchText] = useState("");

  const [searchResultSongs, setSearchResultSongs] = useState([]);

  const [searchResultArtists, setSearchResultArtists] = useState([]);

  const [isTopResultHovering, setTopResultHovering] = useState(false);

  const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState({});

  useEffect(() => {
    read_OneValue_from_Database(
      "Users/" + auth.currentUser.uid + "/currenlyPlaying",
      (data) => {
        setCurrentlyPlayingSong(data);
      }
    );
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      read_from_Database_onChange_query(
        "Songs",
        searchText.charAt(0).toUpperCase() + searchText.slice(1),
        "title",
        (data) => {
          console.log(data);
          setSearchResultSongs(data);
          console.log(searchText.charAt(0).toUpperCase() + searchText.slice(1));
        }
      );
    } else {
      setSearchResultSongs([]);
    }
  }, [searchText]);

  const setCurrentlyPlaying = (song) => {
    const userAgent = navigator.userAgent;
    updateDatabase("Users/" + auth.currentUser.uid, {
      currenlyPlaying: { ...song, status: "playing", device: userAgent },
    });
    props.setCurrentPlaying(song);
  };

  return (
    <div className="my-[15px] mt-[40px] mx-[5px] mr-[20px] rounded-[10px] bg-[#131313] w-full relative mainHeight">
      <div className="absolute right-0 top-0 m-[10px] flex">
        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[10px]">
          <FaRegBell />
        </div>

        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[10px]">
          <MdGroups2 className="w-[20px] h-[20px]" />
        </div>

        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px]">
          <FaUser />
        </div>
      </div>

      <div className="flex items-center m-[10px]">
        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px] rotate-180 cursor-pointer">
          <GrNext className="w-[20px] h-[20px]" />
        </div>

        <div className="w-[30px] h-[30px] rounded-[50%] bg-[#020202] flex justify-center items-center p-[10px] mr-[5px] cursor-pointer">
          <GrNext className="w-[20px] h-[20px]" />
        </div>

        <div className="ml-[10px] w-[350px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="relative h-fit flex items-center bg-transparent border border-[#A7A7A7] text-white w-full rounded-[20px]">
              <IoSearchOutline className="ml-[10px]" />
              <input
                required
                type="text"
                placeholder="What do you want to listen to?"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
                className="bg-transparent text-white p-[8px] w-full font-thin"
              />
            </div>
          </form>
        </div>
      </div>

      {searchResultSongs.length > 0 ? (
        <div className="w-full h-[230px] mt-[20px]">
          <div className="flex w-[95%] m-auto h-full">
            <div className="w-[500px] h-full">
              <h1 className="text-[18px]">Top result</h1>
              <div
                className={
                  isTopResultHovering
                    ? "w-[95%] h-full bg-[#303030] rounded-[10px] mt-[10px] p-[20px] relative cursor-pointer topResult"
                    : "w-[95%] h-full bg-[#212121] rounded-[10px] mt-[10px] p-[20px] relative"
                }
                onMouseEnter={(event) => {
                  setTopResultHovering(true);
                }}
                onMouseLeave={(event) => {
                  setTopResultHovering(false);
                }}
              >
                <div className="w-[120px] h-[120px] rounded-[10px]">
                  <img
                    src={searchResultSongs[0].coverURL}
                    alt=""
                    className="w-[120px] h-[120px] rounded-[10px] object-cover"
                  />
                </div>

                <div className="mt-[15px]">
                  <h1 className="text-[20px]">{searchResultSongs[0].title}</h1>
                  <p className="text-[13px] mt-[5px]">
                    {" "}
                    <span className="text-[#A7A7A7] font-extralight">
                      Song
                    </span>{" "}
                    • {searchResultSongs[0].artist}
                  </p>
                </div>

                {isTopResultHovering && (
                  <div className="absolute w-full h-full top-0 left-0 rounded-[10px] topResultPlayButton">
                    <div
                      className="w-[50px] h-[50px] rounded-[50%] bg-[#00ff00] absolute bottom-0 right-0 m-[20px] flex items-center justify-center shadowBlack topResultPlay"
                      onClick={(event) => {
                        setCurrentlyPlaying(searchResultSongs[0]);
                      }}
                    >
                      {currentlyPlayingSong.songURL ===
                        searchResultSongs[0].songURL &&
                      currentlyPlayingSong.status === "playing" ? (
                        <IoMdPause className="w-[25px] h-[25px] text-black" />
                      ) : (
                        <IoMdPlay className="w-[25px] h-[25px] text-black ml-[5px]" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-[18px]">Songs</h1>
              <div className="h-full rounded-[10px] mt-[10px] p-[20px] w-full">
                {searchResultSongs.map((song, index) => {
                  return <Song key={index} songItem={song} />;
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Search;
