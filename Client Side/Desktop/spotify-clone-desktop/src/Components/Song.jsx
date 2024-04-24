import React, { useEffect, useState } from "react";
import { IoMdPlay } from "react-icons/io";

const Song = (props) => {

    const [isSongHovering, setSongHovering] = useState(false);

    const audio = new Audio(props.songItem.songURL);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        audio.addEventListener("loadedmetadata", () => {
          setDuration(audio.duration);
          // updateDatabase("Users/" + auth.currentUser.uid, { currenlyPlaying: {...currentlyPlaying, duration: audio.duration} });
        });
    }, [])

  return (
    <div
      className={
        isSongHovering
          ? "w-full h-[60px] flex items-center rounded-[5px] cursor-pointer bg-[#303030] p-[10px] relative"
          : "w-full h-[60px] flex items-center rounded-[5px] p-[10px] cursor-pointer relative"
      }
      onMouseEnter={(event) => {
        setSongHovering(true);
      }}
      onMouseLeave={(event) => {
        setSongHovering(false);
      }}
    >
      <div className="w-[50px] h-[50px] rounuded-[6px] relative flex items-center justify-center">
        <img
          src={props.songItem.coverURL}
          alt=""
          className="w-[50px] h-[50px] rounded-[6px] object-cover"
        />
        {isSongHovering && (
          <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
            <IoMdPlay className="w-[25px] h-[25px]" />
          </div>
        )}
        <div></div>
      </div>

      <div className="ml-[15px] flex flex-col">
        <h1>{props.songItem.title}</h1>
        <p className="text-[12px] text-[#A7A7A7]">{props.songItem.artist}</p>
      </div>

      <div className="h-full flex items-center absolute right-0 mr-[10px]">
        <p className="text-[#A7A7A7] text-[12px]">{formatTime(duration)}</p>
      </div>
    </div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Song;
