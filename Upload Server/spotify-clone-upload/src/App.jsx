import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  HashRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import "./App.css";
import SideBar from "./Layouts/SideBar/SideBar";
import Upload from "./Pages/Upload";
import Account from "./Pages/Account";
import { createUser, loginUser } from "./utils/firebaseUser";
import { auth } from "./utils/firebase";
import CircularProgress from "@mui/joy/CircularProgress";


function App() {
  const [isLogin, setLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loginShowPassword, setLoginShowPassword] = useState(false);

  const [Email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(true);

  const [isTaskRunning, setTaskRunning] = useState(false);

  const login = () => {
    setLoading(true);
    loginUser(Email, loginPassword).catch((e) => {
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
      setLoading(false)
    }).then(() => {
      setLoginPassword("");
      setLoading(false);
    })
  };

  const createAccount = () => {
    if(registerPassword === confirmPassword) {
      createUser(name, Email, registerPassword, (completion) => {
        if (completion === "true") {
          setUser(auth.currentUser.uid);
          // setLoading(false);
          setConfirmPassword("");
          setRegisterPassword("");
        } else {
          // setLoading(false);
          setConfirmPassword("");
          setRegisterPassword("");
        }
      });
    } else {
      alert("Passwords do not match")
      // setLoading(false);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  let timeOut = setTimeout(() => {
    if(user == null) {
      setLoggedIn(false);
    }
  }, 1000);

  return user === null ? (
    !isLoggedIn ? (
      <div className="relative flex justify-center items-center w-screen h-screen backgroundMain">
      <div className="w-full m-auto rounded-[10px] h-full z-10 loginWrapper flex justify-center">
        {isLogin ? (
          <div className="w-[40%] m-auto h-[300px] bg-[#0B0B0b] rounded-[20px] flex px-[20px] login">
            <div className="mr-[20px] flex-1 flex items-center flex-col justify-center div">
              <FaSpotify className="text-[#00A400] w-[50px] h-[50px]" />
              <h1 className="text-white text-3xl">Spotify</h1>
              <p className="text-[15px] font-thin">for Artists</p>

              <p className="mt-[30px] text-[#A7A7A7]"> Log in to Continue</p>
            </div>

            <div className="flex-1 p-[20px] flex items-center bg-white rounded-[20px] flex-col div">
              <h1 className="text-[20px] font-bold mt-[10px] text-black">
                Login
              </h1>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                }}
                className="w-full flec flex-col items-center mt-[10px]"
              >
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
                  className="bg-transparent border border-[#A7A7A7] mt-[10px] text-black p-[10px] w-full rounded-[20px] "
                />

                <div className="relative h-fit flex justify-center mt-[10px]">
                  <input
                    required
                    type={loginShowPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                    }}
                    className="bg-transparent border border-[#A7A7A7] text-black p-[10px] w-full rounded-[20px]"
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

                {isLoading ? (
                  <div className="w-full flex justify-center items-center mt-[15px]">
                    <CircularProgress />
                  </div>
                ) : (
                  <button
                    className="bg-[#00A400] text-white mt-[15px] p-[10px] rounded-[20px] w-full"
                    onClick={(event) => {
                      login();
                    }}
                  >
                    Log In
                  </button>
                )}
              </form>
              <div>
                <p className="text-[#A7A7A7] mt-[10px] text-[13px]">
                  Don't have an account?
                  <button
                    className="text-[#00A400] ml-[5px]"
                    onClick={(event) => {
                      setLogin(false);
                    }}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[40%] m-auto h-[400px] bg-[#0B0B0b] rounded-[20px] flex px-[20px] register">
            <div className="mr-[20px] flex-1 flex items-center flex-col justify-center div">
              <FaSpotify className="text-[#00A400] w-[50px] h-[50px]" />
              <h1 className="text-white text-3xl">Spotify</h1>
              <p className="text-[15px] font-thin">for Artists</p>

              <p className="mt-[30px] text-[#A7A7A7]">Welcome to Spotify</p>
            </div>

            <div className="flex-1 p-[20px] flex items-center bg-white rounded-[20px] flex-col div">
              <h1 className="text-[20px] font-bold mt-[10px] text-black">
                Login
              </h1>
              <form
                onSubmit={event => {event.preventDefault()}}
                className="w-full flec flex-col items-center mt-[10px]"
              >
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  name=""
                  id=""
                  className="bg-transparent border border-[#A7A7A7] mt-[10px] text-black p-[10px] w-full rounded-[20px] "
                />

                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={Email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  name=""
                  id=""
                  className="bg-transparent border border-[#A7A7A7] mt-[10px] text-black p-[10px] w-full rounded-[20px] "
                />

                <div className="relative h-fit flex justify-center mt-[10px]">
                  <input
                    required
                    type={loginShowPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(event) => {
                      setRegisterPassword(event.target.value);
                    }}
                    placeholder="Password"
                    className="bg-transparent border border-[#A7A7A7] text-black p-[10px] w-full rounded-[20px]"
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
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    placeholder="Confirm Password"
                    className="bg-transparent border border-[#A7A7A7] text-black p-[10px] w-full rounded-[20px]"
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
                    Join
                  </button>
                )}
              </form>
              <div>
                <p className="text-[#A7A7A7] mt-[10px] text-[13px]">
                  Already have an account?
                  <button
                    className="text-[#00A400] ml-[5px]"
                    onClick={(event) => {
                      setLogin(true);
                    }}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    ) : (
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        <CircularProgress />
        <h1 className="mt-[10px]">Loading</h1>
      </div>
    )
  ) : (
    <>
      <div>
        <HashRouter>
          <SideBar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/upload" exact element={<Upload />} />
            <Route path="/account" exact element={<Account setUser = {setUser}/>} />
          </Routes>
        </HashRouter>
      </div>
    </>
  );
}

export default App;
