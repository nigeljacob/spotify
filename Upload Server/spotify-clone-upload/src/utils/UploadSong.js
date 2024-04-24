import axios from 'axios';
import { auth } from './firebase';
import { Song } from './classes';
import { generateKey, uploadToStrorage } from './firebseCRUD';
import { getDownloadURL } from 'firebase/storage';

export const uploadNewSong = (SongName, ArtistName, AlbumnName, SongPath, SongCover, Genre, callback) => {
    let date = getTimeDate()
    let uploadFile = uploadMusicFile(SongPath, SongName + "_" + ArtistName + "_" + date[0].split("/")[0] + "-" + date[0].split("/")[1] + "-" + date[0].split("/")[2] + "_" + date[1] + ".mp3", (URL) => {
        callback(URL);

    });
    console.log(uploadFile);
}

export const uploadSongPic = (UID, Image, ArtistName, SongName, onImageUploaded) => {
    const uploadTask = uploadToStrorage("Songs/" + UID + "/" + ArtistName + "/" + SongName + "/cover.png", Image);

    uploadTask.on("state_changed",
      (snapshot) => {},
      (error) => {
        console.log("error uploading photo")
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onImageUploaded(downloadURL)
        });
      }
    );
}

export async function uploadMusicFile(file, fileName, callback) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('music', file, fileName);

        axios.post('https://nnjtrading.com/wp-json/myapp/v1/upload-music', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // If needed, add additional headers here
            },
        })
        .then(response => {
            console.log('Music file uploaded successfully');
            callback(response.data);
        })
        .catch(error => {
            console.error('Error uploading music file:', error);
            callback("error");
            console.log("error");
        });
    });
}

// get time and date using a function
const getTimeDate = () => {
  let newDate = new Date();

  let month = newDate.getMonth() + 1;

  let hours = newDate.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = newDate.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  return [
    newDate.getDate() + "/" + month + "/" + newDate.getFullYear(),
    hours + ":" + minutes,
  ];
};

