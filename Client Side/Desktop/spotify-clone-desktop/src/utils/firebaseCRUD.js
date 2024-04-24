import { onValue, push, ref, set, get, child, update, orderByChild, startAt } from "firebase/database";
import { ref as reference, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { firebaseRealtimeDatabase } from "./firebase";
import { firebaseStorage } from "./firebase";

// write to firebase Realtime Database with and without unique key
export const writeToDatabase = (referencePath, data) => {
  return set(ref(firebaseRealtimeDatabase, referencePath), data);
};

export const updateDatabase = (referencePath, data) => {
  return update(ref(firebaseRealtimeDatabase, referencePath), data);
};

// export const generateKey = (referencePath) => {
//   return push(ref(firebaseRealtimeDatabase, referencePath)).key();
// };

export const generateKey = (referencePath) => {
  // Push a new child entry to the specified reference path
  const childRef = push(ref(firebaseRealtimeDatabase, referencePath));
  // Retrieve the key of the newly generated child entry
  return childRef.key;
};

// Read one value from firebase Realtime database
export const read_OneValue_from_Database = (referencePath, onDataReceived) => {
  const dataReference = ref(firebaseRealtimeDatabase, referencePath);
  onValue(dataReference, (snapshot) => {
    onDataReceived(snapshot.val())
  });
};

// Read a group of values from firebase Realtime database
export const read_from_Database_onChange = (referencePath, onDataReceived) => {
  const dataReference = ref(firebaseRealtimeDatabase, referencePath);

  onValue(dataReference, (snapshot) => {
    let dataList = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      dataList.push(data);
    });

    onDataReceived(dataList)
  })
};

// Read a group of values from firebase Realtime database
export const read_from_Database_onChange_query = (referencePath, searchQuery, property, onDataReceived) => {
  const dataReference = ref(firebaseRealtimeDatabase, referencePath);

  onValue(dataReference, (snapshot) => {
    let dataList = []
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.title.startsWith(searchQuery)) {
        dataList.push(data);
      }
    });

    onDataReceived(dataList)
  })
};

// Read value once from firebase database
export const readOnceFromDatabase = (referencePath, onDataReceived) => {

  const dataReference = ref(firebaseRealtimeDatabase, referencePath);

  get(dataReference)
    .then((snapshot) => {
      if (snapshot.exists()) {
        onDataReceived(snapshot.val())
      } else {
        onDataReceived(null)
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
};

export const uploadToStrorage = (referencePath, data) => {
  const storageRef = reference(firebaseStorage, referencePath);
  
  return uploadBytesResumable(storageRef, data);
}

// export const updateProfilePic = async (file, currentUser, onUpload) => {
//   const fileRef = ref(storage, currentUser.uid + '.png');

  
//   const snapshot = await uploadBytes(fileRef, file);
//   const photoURL = await getDownloadURL(fileRef);

//   onUpload(photoURL)

// }

// Get profile Picture
export const getProfilePicture = (referencePath) => {
  return null;
};
