import { auth } from "./firebase";

export const User = (Name, Email, currenlyPlaying, queue, followersCount, followingCount, uploads, followers, following, activeDevices, profileURL) => {
    return {
        Name: Name,
        Email: Email,
        currenlyPlaying: currenlyPlaying,
        queue: queue,
        followersCount: followersCount,
        followingCount: followingCount,
        uploads: uploads,
        followers: followers,
        following: following,
        activeDevices: activeDevices
    };
}

export const Song = (title, artist, duration, album, genre, listenes, coverURL, songURL, songID) => { 
    return { 
        title: title, 
        artist: artist, 
        duration: duration, 
        album: album, 
        genre: genre,
        listenes: listenes,
        coverURL: coverURL,
        songURL: songURL,
        date: getTimeDate()[0], 
        time: getTimeDate()[1],
        status: "Uploaded",
        artistUID: auth.currentUser.uid,
        likes: 0,
        songID: songID
    }; 
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