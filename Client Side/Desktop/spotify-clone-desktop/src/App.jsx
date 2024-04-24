import { useState, useEffect } from "react";
import { FaSpotify } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./App.css";
import { createUser, loginUser } from "./utils/userAccount";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  HashRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import SideBar from "./Layouts/Sidebar/Sidebar";
import { auth } from "./utils/firebase";
import Home from "./Pages/Home";
import Search from "./Pages/Search";
import YourLibrary from "./Pages/YourLibrary";
import Player from "./Layouts/Player/Player";
import loading from "./assets/loading.gif";

function App() {
  const [isLoginClicked, setLoginClicked] = useState(false);
  const [isSignupClicked, setSignupClicked] = useState(false);

  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const [user, setUser] = useState(null);

  const [Email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [isLoggedIn, setLoggedIn] = useState(true);

  const [currentlyPlaying, setCurrentPlaying] = useState(null);

  const login = () => {
    loginUser(Email, loginPassword)
      .catch((e) => {
        const errorMessage = e.message;
        const errorCode = errorMessage.match(/\(auth\/([^)]+)\)/)[1];
        const formattedErrorCode = errorCode.replace(/-/g, " ");
        let message =
          formattedErrorCode.charAt(0).toUpperCase() +
          formattedErrorCode.slice(1);

        if (message.includes("Configuration")) {
          message = "User not found... Try Signing Up";
        }

        alert(message);
        setLoginPassword("");
      })
      .then(() => {
        setLoginPassword("");
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  setTimeout(() => {
    if (auth.currentUser === null) {
      setLoggedIn(false);
    }
  }, 600);

  const createAccount = () => {
    if (registerPassword === confirmPassword) {
      createUser(name, Email, registerPassword, (response) => {
        if (response === "true") {
          setName("");
          setEmail("");
          setRegisterPassword("");
          setConfirmPassword("");
          setSignupClicked(false);
          setUser(auth.currentUser);
        }
      });
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <>
      <div className="titleBar"></div>

      {user === null ? (
        isLoggedIn ? (
          <>
            <div className="w-screen h-screen bg-[#000] flex justify-center items-center">
              <img src={loading} alt="" className="w-[150px]" />
            </div>
          </>
        ) : (
          <div className="w-screen h-screen background_login">
            <div className="w-full h-full flex justify-center items-center loginWrapper">
              <div className="w-[400px] h-[390px] bg-[#0B0B0B] rounded-[10px] flex justify-center">
                {!isLoginClicked && !isSignupClicked ? (
                  <div className="flex flex-col items-center mt-[40px] text-center fadeInOpen">
                    <div className="flex items-center">
                      <FaSpotify className="w-[40px] h-[40px]" />
                      <h1 className="ml-[5px] text-[30px] relative">
                        Spotify{" "}
                        <div className="rounded-[50%] border absolute top-0 right-0 mr-[-10px] w-[10px] h-[10px] flex justify-center">
                          <p className="text-[7px]">R</p>
                        </div>
                      </h1>
                    </div>

                    <h1 className="text-[25px] mt-[25px] font-bold">
                      Millions of songs,<br></br>Free on Spotify.
                    </h1>

                    <button
                      className="px-[25px] py-[10px] bg-[#3dce3d] text-black rounded-[20px] mt-[30px]"
                      onClick={(event) => {
                        setLoginClicked(true);
                      }}
                    >
                      Log in
                    </button>

                    <div>
                      <h2 className="text-[#A7A7A7] mt-[30px] text-[14px]">
                        New to Spotify? {"  "}
                        <span
                          className="text-white cursor-pointer ml-[3px]"
                          onClick={(event) => {
                            setSignupClicked(true);
                          }}
                        >
                          Sign up for free
                        </span>
                      </h2>
                    </div>
                    <h2 className="text-[10px] text-[#A7A7A7] mt-[30px] cursor-pointer">
                      SETTINGS
                    </h2>
                  </div>
                ) : isSignupClicked ? (
                  <>
                    <div className="flex flex-col items-center mt-[10px] text-center w-full fadeInOpen">
                      <div
                        className="w-full px-[20px] cursor-pointer"
                        onClick={(event) => {
                          setSignupClicked(false);
                        }}
                      >
                        <IoMdArrowRoundBack className="w-[30x] h-[30px]" />
                      </div>
                      <h1>Sign Up</h1>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                        }}
                      >
                        <div className="w-[300px] mt-[5px]">
                          <input
                            required
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(event) => {
                              setName(event.target.value);
                            }}
                            name=""
                            id=""
                            className="bg-transparent border border-[#A7A7A7] mt-[10px] text-white p-[10px] w-full rounded-[20px] "
                          />

                          <input
                            required
                            type="text"
                            placeholder="Email"
                            value={Email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
                            name=""
                            id=""
                            className="bg-transparent border border-[#A7A7A7] mt-[10px] text-white p-[10px] w-full rounded-[20px] "
                          />

                          <div className="relative h-fit flex justify-center mt-[10px]">
                            <input
                              required
                              type={loginShowPassword ? "text" : "password"}
                              placeholder="Password"
                              value={registerPassword}
                              onChange={(event) => {
                                setRegisterPassword(event.target.value);
                              }}
                              className="bg-transparent border border-[#A7A7A7] text-white p-[10px] w-full rounded-[20px]"
                            />
                            {loginShowPassword ? (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Hide
                              </p>
                            ) : (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Show
                              </p>
                            )}
                          </div>

                          <div className="relative h-fit flex justify-center mt-[10px]">
                            <input
                              required
                              type={loginShowPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              onChange={(event) => {
                                setConfirmPassword(event.target.value);
                              }}
                              className="bg-transparent border border-[#A7A7A7] text-white p-[10px] w-full rounded-[20px]"
                            />
                            {loginShowPassword ? (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Hide
                              </p>
                            ) : (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Show
                              </p>
                            )}
                          </div>
                        </div>

                        {isLoading ? (
                          <div className="w-full flex justify-center items-center mt-[15px]">
                            <CircularProgress />
                          </div>
                        ) : (
                          <button
                            className="bg-[#00A400] text-white mt-[15px] p-[10px] rounded-[20px] w-full"
                            onClick={(event) => {
                              createAccount();
                            }}
                          >
                            Sign Up
                          </button>
                        )}
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center mt-[20px] text-center w-full fadeInOpen">
                      <div
                        className="w-full px-[20px] cursor-pointer"
                        onClick={(event) => {
                          setLoginClicked(false);
                        }}
                      >
                        <IoMdArrowRoundBack className="w-[30x] h-[30px]" />
                      </div>
                      <h1>Login</h1>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                        }}
                      >
                        <div className="w-[300px] mt-[10px]">
                          <input
                            required
                            type="text"
                            placeholder="Email"
                            value={Email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
                            name=""
                            id=""
                            className="bg-transparent border border-[#A7A7A7] mt-[10px] text-white p-[10px] w-full rounded-[20px] "
                          />
                          <div className="relative h-fit flex justify-center mt-[20px]">
                            <input
                              required
                              type={loginShowPassword ? "text" : "password"}
                              placeholder="Password"
                              value={loginPassword}
                              onChange={(event) => {
                                setLoginPassword(event.target.value);
                              }}
                              className="bg-transparent border border-[#A7A7A7] text-white p-[10px] w-full rounded-[20px]"
                            />
                            {loginShowPassword ? (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Hide
                              </p>
                            ) : (
                              <p
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer text-[12px]"
                                onClick={(event) => {
                                  setLoginShowPassword(!loginShowPassword);
                                }}
                              >
                                Show
                              </p>
                            )}
                          </div>
                        </div>

                        {isLoading ? (
                          <div className="w-full flex justify-center items-center mt-[15px]">
                            <CircularProgress />
                          </div>
                        ) : (
                          <button
                            className="bg-[#00A400] text-white mt-[25px] p-[10px] rounded-[20px] w-full"
                            onClick={(event) => {
                              login();
                            }}
                          >
                            Log In
                          </button>
                        )}
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          <div className="w-screen h-screen flex relative">
            <HashRouter>
              <SideBar />
              <Routes>
                <Route
                  path="/"
                  exact
                  element={<Home setUser={setUser} user={user} />}
                />
                <Route
                  path="/search"
                  exact
                  element={<Search setCurrentPlaying={setCurrentPlaying} />}
                />
                <Route path="/library" exact element={<YourLibrary />} />
              </Routes>
              <div className="absolute bottom-0 left-0">
                <Player currentlyPlaying={currentlyPlaying} />
              </div>
            </HashRouter>
          </div>
        </>
      )}
    </>
  );
}

export default App;
