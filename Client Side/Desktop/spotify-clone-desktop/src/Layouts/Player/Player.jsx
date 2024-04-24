import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaPause } from "react-icons/fa6";
import { MdSkipPrevious } from "react-icons/md";
import { CiShuffle } from "react-icons/ci";
import { RiRepeat2Line } from "react-icons/ri";
import { IoMdPlay } from "react-icons/io";
import { GiMicrophone } from "react-icons/gi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { FaComputer } from "react-icons/fa6";
import {
  IoVolumeMediumOutline,
  IoVolumeMuteOutline,
  IoVolumeHighOutline,
} from "react-icons/io5";
import { LuMaximize2 } from "react-icons/lu";
import { IoTriangleSharp } from "react-icons/io5";
import { RiSpeakerFill } from "react-icons/ri";
import {
  read_OneValue_from_Database,
  read_from_Database_onChange,
  updateDatabase,
} from "../../utils/firebaseCRUD";
import { auth } from "../../utils/firebase";

const Player = (props) => {
  const [differentDevice, setDefaultDevice] = useState(false);
  const [isPlayerHovering, setPlayerHovering] = useState(false);

  const [currentlyPlaying, setCurrentPlaying] = useState(null);

  const [isPlaying, setPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // Initial volume set to 50%

  const userAgent = navigator.userAgent;

  const [audio, setAudio] = useState(null);

  const handleMouseEnter = () => {
    setPlayerHovering(true);
  };

  const handleMouseLeave = () => {
    setPlayerHovering(false);
  };

  useEffect(() => {
    read_OneValue_from_Database("Users/" + auth.currentUser.uid, (user) => {
      if (user.currenlyPlaying != "") {
        setCurrentPlaying(user.currenlyPlaying);

        if (user.currenlyPlaying.device != userAgent) {
          setDefaultDevice(true);
        } else {
          setDefaultDevice(false);
        }

        if (user.currenlyPlaying.status === "playing") {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (props.currentlyPlaying != null) {
      setAudio(new Audio(props.currentlyPlaying.songURL));
    }
  }, [props.currentlyPlaying]);

  useEffect(() => {
    if (audio != null) {
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      if (
        currentlyPlaying.status == "playing" &&
        currentlyPlaying.device == userAgent
      ) {
        audio.play();
        setPlaying(true);

        audio.addEventListener("timeupdate", () => {
          setCurrentTime(audio.currentTime);
          // updateDatabase("Users/" + auth.currentUser.uid, {
          //   currenlyPlaying: {
          //     ...currentlyPlaying,
          //     currentTime: audio.currentTime,
          //   },
          // });
        });

        audio.addEventListener("play", () => {
          setPlaying(true);
          updateDatabase("Users/" + auth.currentUser.uid, {
            currenlyPlaying: { ...currentlyPlaying, status: "playing" },
          });
        });

        audio.addEventListener("pause", () => {
          setPlaying(false);
          updateDatabase("Users/" + auth.currentUser.uid, {
            currenlyPlaying: { ...currentlyPlaying, status: "paused" },
          });
        });

        return () => {
          audio.removeEventListener("loadedmetadata", () => {});
          audio.removeEventListener("timeupdate", () => {});
          audio.removeEventListener("play", () => {});
          audio.removeEventListener("pause", () => {});
        };
      }
    }
  }, [audio]);

  useEffect(() => {
    if (currentlyPlaying != null) {
      if (props.currentlyPlaying == null) {
        setAudio(new Audio(currentlyPlaying.songURL));
      } else if (audio != null) {
        if(audio.src != currentlyPlaying.songURL) {
          audio.pause();
          audio.src = currentlyPlaying.songURL;
          audio.load();
        }
      }
    }
  }, [props.currentlyPlaying]);

  useEffect(() => {
    if (audio != null) {
      if (!isPlaying) {
        audio.pause();
        updateDatabase("Users/" + auth.currentUser.uid, {
          currenlyPlaying: { ...currentlyPlaying, status: "paused" },
        });
      } else {
        audio.play();
        updateDatabase("Users/" + auth.currentUser.uid, {
          currenlyPlaying: { ...currentlyPlaying, status: "playing" },
        });
      }
    } else {
      if (currentlyPlaying != null) {
        if (!isPlaying) {
          updateDatabase("Users/" + auth.currentUser.uid, {
            currenlyPlaying: { ...currentlyPlaying, status: "paused" },
          });
        } else {
          updateDatabase("Users/" + auth.currentUser.uid, {
            currenlyPlaying: { ...currentlyPlaying, status: "playing" },
          });
        }
      }
    }
  }, [isPlaying]);

  const handleSliderChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    audio.currentTime = newTime;
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  return (
    <div className="h-[90px] w-screen bg-[#030303] select-none">
      <div
        className={
          differentDevice
            ? "w-full h-[70px] flex items-center"
            : "w-full h-[90px] flex items-center"
        }
      >
        <div className="flex flex-1 items-center">
          <div className="w-[55px] h-[55px] bg-[#171717] rounded-[8px] ml-[15px]">
            {currentlyPlaying != null && (
              <img
                src={currentlyPlaying.coverURL}
                alt=""
                className="w-[55px] h-[55px] rounded-[8px] object-cover"
              />
            )}
          </div>
          <div className="flex flex-col ml-[10px] justify-center h-[55px]">
            {currentlyPlaying != null ? (
              <div>
                <h1 className="text-[15px]">{currentlyPlaying.title}</h1>
                <p className="text-[10px] text-[#A7A7A7] mt-[-3px]">
                  {currentlyPlaying.artist}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-[15px] min-w-[50px] min-h-[20px] "></h1>
                <p className="text-[10px] text-[#A7A7A7] mt-[-3px] min-w-[50px] min-h-[20px]"></p>
              </div>
            )}
          </div>
          <CiHeart className="ml-[15px] w-[20px] h-[20px]" />
        </div>
        <div className="flex flex-col flex-1 justify-center h-[55px] items-center w-full">
          <div className="flex justify-center">
            <div className="w-[30px] h-[30px] flex justify-center items-center mr-[10px]">
              <CiShuffle className="text-white w-[18px] h-[18px]" />
            </div>
            <div className="w-[30px] h-[30px] flex justify-center items-center mr-[10px]">
              <MdSkipPrevious className="text-white w-[25px] h-[25px]" />
            </div>
            <div
              className="w-[30px] h-[30px] bg-[#fff] rounded-[50%] flex justify-center items-center cursor-pointer"
              onClick={(event) => {
                setPlaying(!isPlaying);
              }}
            >
              {isPlaying ? (
                <FaPause className="text-black" />
              ) : (
                <IoMdPlay className="text-black ml-[2px]" />
              )}
            </div>
            <div className="w-[30px] h-[30px] flex justify-center items-center ml-[10px] rotate-180">
              <MdSkipPrevious className="text-white w-[25px] h-[25px]" />
            </div>
            <div className="w-[30px] h-[30px] flex justify-center items-center ml-[10px]">
              <RiRepeat2Line className="text-white w-[18px] h-[18px]" />
            </div>
          </div>
          <div
            className="flex ml-[10px] items-center h-[55px] w-full mt-[5px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <p className="text-[10px] mr-[10px] w-[20px]">
              {formatTime(currentTime)}
            </p>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              step="0.01"
              onChange={handleSliderChange}
              className="w-full bg-[#00ff00]"
            />
            <p className="text-[10px] ml-[10px] w-[20px]">
              {formatTime(duration)}
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end pr-[20px]">
          <div className="flex justify-center items-center mr-[5px] border border-[#A7A7A7] rounded-[2px] w-[15px] h-[18px]">
            <IoMdPlay className="text-[#A7A7A7] w-[10px] h-[10px]" />
          </div>
          <div className="w-[30px] h-[30px] flex justify-center items-center mr-[5px]">
            <GiMicrophone className="text-[#A7A7A7] w-[15px] h-[15px]" />
          </div>
          <div className="w-[30px] h-[30px] flex justify-center items-center mr-[5px]">
            <HiOutlineQueueList className="text-[#A7A7A7] w-[18px] h-[18px]" />
          </div>
          <div className="w-[30px] h-[30px] flex justify-center items-center mr-[5px]">
            <FaComputer className="text-[#A7A7A7] w-[18px] h-[18px]" />
          </div>
          <div className="w-[135px] h-[30px] flex justify-center items-center mr-[5px]">
            {volume != 0 ? (
              volume < 0.5 ? (
                <IoVolumeMediumOutline
                  className="text-[#A7A7A7] w-[18px] h-[18px] cursor-pointer"
                  onClick={(event) => {
                    if (volume == 0) {
                      setVolume(1);
                      audio.volume = 1.0;
                    } else {
                      setVolume(0);
                      audio.volume = 0.0;
                    }
                  }}
                />
              ) : (
                <IoVolumeHighOutline
                  className="text-[#A7A7A7] w-[18px] h-[18px] cursor-pointer"
                  onClick={(event) => {
                    if (volume == 0) {
                      setVolume(1);
                      audio.volume = 1.0;
                    } else {
                      setVolume(0);
                      audio.volume = 0.0;
                    }
                  }}
                />
              )
            ) : (
              <IoVolumeMuteOutline
                className="text-[#A7A7A7] w-[18px] h-[18px] cursor-pointer"
                onClick={(event) => {
                  if (volume == 0) {
                    setVolume(1);
                    audio.volume = 1.0;
                  } else {
                    setVolume(0);
                    audio.volume = 0.0;
                  }
                }}
              />
            )}
            <input
              type="range"
              min="0"
              max="1"
              value={volume}
              step="0.01"
              onChange={handleVolumeChange}
              className="w-[100px] bg-[#00ff00] ml-[5px]"
            />
          </div>
          <div className="w-[30px] h-[30px] flex justify-center items-center mr-[5px]">
            <LuMaximize2 className="text-[#A7A7A7] w-[15px] h-[15px]" />
          </div>
        </div>
      </div>

      {differentDevice && (
        <>
          <div className="min-w-full max-w-full h-[20px] bg-[#00ff00] relative flex items-center text-black">
            <div className="flex items-center ml-[10px]">
              <RiSpeakerFill />
              <h1 className="ml-[10px] text-[12px]">
                Currently playing on <span>{currentlyPlaying.device}</span>
              </h1>
            </div>

            <div className="absolute top-0 right-0 mr-[206px] mt-[-10px] text-[#00ff00]">
              <IoTriangleSharp />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;
