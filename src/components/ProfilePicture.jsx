
import { getDownloadURL,ref, getStorage } from "firebase/storage";
import { useEffect, useState } from "react";
// import { getAuth } from "firebase/auth";

const ProfilePicture = ({imgId}) => {

let [profilePicture, setProfilePicture] = useState("")
const storage = getStorage()
const profileRef= ref(storage,imgId)


useEffect(()=> {
    getDownloadURL(profileRef)
    .then((url)=> {
        setProfilePicture(url)
    })
    .catch((error)=> {
        console.log(error)
    })
},[])
    return (
        <div>
            <img src={profilePicture} alt="profike picture" />
        </div>
    );
};

export default ProfilePicture;