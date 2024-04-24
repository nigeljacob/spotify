import React, { useEffect, useState, useRef } from "react";
import { auth } from "../utils/firebase";
import {
  generateKey,
  readOnceFromDatabase,
  read_from_Database_onChange,
  updateDatabase,
  writeToDatabase,
} from "../utils/firebseCRUD";
import { uploadNewSong, uploadSongPic } from "../utils/UploadSong.js";
import { Song } from "../utils/classes.js";
import CircularProgress from "@mui/joy/CircularProgress";

const Upload = () => {
  const [myUploads, setMyUploads] = useState([]);

  const [SongName, setSongName] = useState("");
  const [ArtistName, setArtistName] = useState(auth.currentUser.displayName);
  const [AlbumName, setAlbumName] = useState("");

  const [uploadOpen, setUploadOpen] = useState(false);

  const [selectedCover, setSelectedCover] = useState("");
  const [selectedCoverImage, setSelectedCoverImage] = useState("");
  const [selectedMusic, setSelectedMusic] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleUpload = () => {
    // Trigger click event on file input to open file explorer dialog
    fileInputRef.current.click();
  };

  const handleUploadImage = () => {
    // Trigger click event on file input to open file explorer dialog
    imageInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFiles = event.target.files;
    setSelectedMusic(selectedFiles[0]);
  };

  const handleSongUpload = () => {
    let newList = myUploads;
    let uploadSong = Song(
      SongName,
      ArtistName,
      getMusicDuration(selectedMusic),
      AlbumName,
      selectedGenre,
      0,
      selectedCover,
      ""
    );

    setUploadOpen(false);
    document.querySelector(".popup").style.transform = "translateY(-1000px)";
    setTimeout(() => {
      document.querySelector(".popup").style.background =
        "background: transparent";
    }, 500);

    newList.push({ ...uploadSong, status: "uploading" });
    setMyUploads(newList);
    uploadNewSong(
      SongName,
      ArtistName,
      AlbumName,
      selectedMusic,
      selectedCover,
      selectedGenre,
      (URL) => {
       if(URL != "error") {
         uploadSongPic(
          auth.currentUser.uid,
          selectedCoverImage,
          ArtistName,
          SongName,
          (ImageURL) => {
            try {
            

              let SongID = generateKey(
                "Songs/" + auth.currentUser.uid + "/" + ArtistName
              );

              let newSong = Song(
                SongName,
                ArtistName,
                getMusicDuration(selectedMusic),
                AlbumName,
                selectedGenre,
                0,
                ImageURL,
                URL,
                SongID
              );

              writeToDatabase(
                "Songs" + "/" + SongID,
                newSong
              ).then(() => {
                updateDatabase("Users/" + auth.currentUser.uid + "/uploads/" + SongID, newSong).catch(() => {
                  let song = myUploads.find((song) => song.status === "uploading");
                  song.status = "FAILED";
                  setMyUploads([...myUploads]);
                  console.log("failed");
                })
              }).catch(() => {
                let song = myUploads.find(
                  (song) => song.status === "uploading"
                );
                song.status = "FAILED";
                setMyUploads([...myUploads]);
                console.log("failed");
              })
            } catch (e) {
              let song = myUploads.find((song) => song.status === "uploading");
              song.status = "FAILED";
              setMyUploads([...myUploads]);
              console.log("failed");
            }
          }
        );
       } else {
          let song = myUploads.find((song) => song.status === "uploading");
          song.status = "FAILED";
          setMyUploads([...myUploads]);
          console.log("failed");
       }
      }
    );

  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedCoverImage(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 500 || img.height < 500) {
            alert("Image must be atleast 1000 x 1000 pixels");
          } else {
            setSelectedCover(reader.result);
            setErrorMessage(null);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    readOnceFromDatabase("Users/" + auth.currentUser.uid + "/Name", (name) => {
      setArtistName(name);
    });

    read_from_Database_onChange(
      "Users/" + auth.currentUser.uid + "/uploads/",
      (songs) => {
        setMyUploads(songs);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div>
      <div className="w-screen p-[30px]">
        <div className="flex items-center">
          <h1 className="text-[30px] text-white mb-[10px] flex-1">
            My Uploads
          </h1>
          <button
            className="bg-[#3dff3d] text-black py-[5px] cursor-pointer px-[10px] rounded-[10px]"
            onClick={(event) => {
              setUploadOpen(true);
              document.querySelector(".popup").style.transform =
                "translateY(0px)";
              setTimeout(() => {
                document.querySelector(".popup").style.background =
                  "rgba(10, 10, 10, 0.7)";
              }, 250);
            }}
          >
            Add New
          </button>
        </div>
        <hr />

        <div className="w-[90%] m-auto mt-[20px]">
          {isLoading ? (
            <div className="w-full flex flex-col justify-center items-center mt-[10px]">
              <CircularProgress />
              <h1 className="mt-[10px]">Loading Uploads</h1>
            </div>
          ) : myUploads.length > 0 ? (
            <>
              <div>
                {myUploads.map((upload, index) => {
                  return (
                    <div className="flex items-center p-[10px] bg-[#0b0b0b] rounded-[10px] h-[80px] mt-[15px]">
                      <div className="flex items-center flex-1">
                        <h1 className="text-[18px]">{index + 1} . </h1>
                        <div>
                          <img
                            src={upload.coverURL}
                            alt="cover"
                            className="w-[50px] h-[50px] object-cover rounded-[10px] ml-[10px] bg-[#0b0b0b]"
                          />
                        </div>
                        <div>
                          <h1 className="text-[18px] ml-[15px]">
                            {upload.title}
                          </h1>
                          <h1 className="text-[13px] ml-[15px]">
                            {upload.artist}
                          </h1>
                        </div>
                      </div>
                      <div className="flex-2 min-w-[300px] justify-center">
                        {upload.status === "uploading" ||
                        upload.status === "FAILED" ? (
                          <div className="flex">
                            {upload.status === "uploading" ? (
                              <h1 className="text-[#00ff00] w-full text-right mr-[10px]">
                                Uploading...
                              </h1>
                            ) : (
                              <h1 className="text-[#ff0000] w-full text-right mr-[10px]">
                                Failed
                              </h1>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="ml-[100px] text-center p-[5px]">
                              <h1>
                                Uploaded on
                                <br />
                                <span className="text-[15px]">
                                  <h1>{upload.date}</h1>
                                </span>
                              </h1>
                            </div>

                            <div className="ml-[100px] text-center p-[5px]">
                              <h1>
                                Listenes
                                <br />
                                <span className="text-[15px]">
                                  <h1>{upload.listenes}</h1>
                                </span>
                              </h1>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex justify-center items-center mt-[10px]">
                <h2 className="font-thin">No Uploads Yet</h2>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadOpen && (
        <div className="w-screen h-screen absolute top-0 right-0 popup flex justify-center items-center">
          <div className="min-w-[500px] max-w-[500px] h-[600px] bg-[#000000] rounded-[20px] p-[20px] white_shadow">
            <div className="flex items-center mb-[10px]">
              <h1 className="flex-1 text-[20px]">Upload Song</h1>
              <button
                className="bg-[#3dff3d] text-[14px] text-black py-[5px] cursor-pointer px-[10px] rounded-[10px] ml-[10px]"
                onClick={(event) => {
                  setUploadOpen(true);
                  document.querySelector(".popup").style.transform =
                    "translateY(-1000px)";
                  setTimeout(() => {
                    document.querySelector(".popup").style.background =
                      "background: transparent";
                  }, 500);
                }}
              >
                Close
              </button>
            </div>

            <hr />

            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="mt-[6px] h-[500px] overflow-y-scroll pr-[15px] pl-[8px]">
                <input
                  required
                  type="text"
                  placeholder="Song Name"
                  value={SongName}
                  onChange={(event) => {
                    setSongName(event.target.value);
                  }}
                  name=""
                  id=""
                  className="bg-transparent border border-[#A7A7A7] mt-[15px] text-white p-[10px] w-full rounded-[10px] "
                />

                <input
                  required
                  type="text"
                  placeholder="Artist Name"
                  value={ArtistName}
                  onChange={(event) => {
                    setArtistName(event.target.value);
                  }}
                  name=""
                  id=""
                  className="bg-transparent border border-[#A7A7A7] mt-[15px] text-white p-[10px] w-full rounded-[10px] "
                />

                <input
                  required
                  type="text"
                  placeholder="Album Name"
                  value={AlbumName}
                  onChange={(event) => {
                    setAlbumName(event.target.value);
                  }}
                  name=""
                  id=""
                  className="bg-transparent border border-[#A7A7A7] mt-[15px] text-white p-[10px] w-full rounded-[10px] "
                />

                <div className="mt-[15px]">
                  <label for="genre" c>
                    Choose a car:
                  </label>

                  <select
                    name="genre"
                    id="genre"
                    className="ml-[10px] rounded-[5px] p-[2px]"
                    onChange={(event) => {
                      setSelectedGenre(event.target.value);
                    }}
                  >
                    <option value="Rock">Rock</option>
                    <option value="Pop">Pop</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Country">Country</option>
                    <option value="blues">Blues</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Folk">Folk</option>
                    <option value="Classical">Classical</option>
                    <option value="Reggae">Reggae</option>
                    <option value="Metal">Metal</option>
                    <option value="Punk">Punk</option>
                    <option value="R&B">R&B</option>
                    <option value="Indie">Indie</option>
                    <option value="Latin">Latin</option>
                    <option value="Soul">Soul</option>
                    <option value="Funk">Funk</option>
                    <option value="Gospel">Gospel</option>
                    <option value="Alternative">Alternative</option>
                    <option value="Dance">Dance</option>
                  </select>
                </div>

                <div className="flex justify-center items-center mt-[20px] w-full bg-[#272727] py-[10px] rounded-[10px] cursor-pointer">
                  <div onClick={handleUpload}>
                    {selectedMusic === "" ? (
                      <span>Select a Music File</span>
                    ) : (
                      <span>{selectedMusic.name}</span>
                    )}
                  </div>
                  {/* Hidden file input element */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                    accept="audio/*"
                  />
                </div>

                <div className="mt-[40px] flex items-center">
                  <div
                    className="w-[150px] h-[150px] rounded-[10px] bg-[#272727] flex-shrink-0 cursor-pointer"
                    onClick={handleUploadImage}
                  >
                    <div className="flex justify-center items-center rounded[10px] w-[150px] h-[150px] hover:opacity-[50%]">
                      {selectedCover != "" ? (
                        <img
                          className="rounded[10px] object-cover w-[150px] h-[150px]"
                          src={selectedCover}
                          alt="coverImage"
                        />
                      ) : (
                        <h1 className="text-[17px]">Upload Cover</h1>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <div className="ml-[20px]">
                    <p className="text-[14px]">
                      1. Choose a square image that is at least{" "}
                      <span className="text-[#00ff00]">1000 x 1000 pixels</span>
                      <br></br>
                      <br></br>
                      2. Use a{" "}
                      <span className="text-[#00ff00]">PNG or JPEG</span> file
                      type
                      <br />
                      <br />
                      3. Make sure the image is less than{" "}
                      <span className="text-[#00ff00]">4MB</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center mt-[30px]">
                  <input type="checkbox" name="" id="" required />
                  <label className="ml-[10px]">
                    I Agree to all the terms and conditions
                  </label>
                </div>

                <button
                  className="w-full bg-[#00ff00] text-black py-[10px] mt-[20px] rounded-[10px]"
                  onClick={(event) => {
                    handleSongUpload();
                  }}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function getMusicDuration(file) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    // Once metadata is loaded, the duration will be available
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src); // Release the object URL
      resolve(audio.duration);
    };

    // If an error occurs while loading the audio
    audio.onerror = (error) => {
      reject(error);
    };
  });
}

export default Upload;
