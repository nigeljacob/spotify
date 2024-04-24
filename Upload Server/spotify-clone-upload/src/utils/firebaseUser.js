import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { writeToDatabase } from "./firebseCRUD"
import { auth } from "./firebase"
import { User } from "./classes"

export const createUser = (Name, Email, Password, callback) => {
    if(Name != "" && Email != "" && Password != ""){
        createUserWithEmailAndPassword(auth, Email, Password).then(() => {
            let user = User(Name, Email, "", "", 0, 0, "", "", "", "", "")
            writeToDatabase("Users/" + auth.currentUser.uid, user).then(() => {
                callback("true")
            })
             updateProfile(auth.currentUser, {
                displayName: displayName,
            }).catch((error) => {
                console.error(error.message);
            });
        }).catch((error) => {
            const errorMessage = error.message;
            const errorCode = errorMessage.match(/\(auth\/([^)]+)\)/)[1];
            const formattedErrorCode = errorCode.replace(/-/g, " ");
            let message =
                formattedErrorCode.charAt(0).toUpperCase() +
                formattedErrorCode.slice(1);

            if (message.includes("Configuration")) {
                message = "User not found... Try Signing Up";
            }

            alert(message);
            callback("error")
        }
            
        )
    }
}

export const loginUser = (Email, Password) => {
    return signInWithEmailAndPassword(auth, Email, Password);
}

export const signOut = () => {
    return auth.signOut();
}