import {  NavLink, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { MdChat, MdNotifications } from "react-icons/md";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import { RiUpload2Fill } from "react-icons/ri";
import { useState } from "react";
import { Cropper } from "react-cropper";
import { createRef } from "react";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import "cropperjs/dist/cropper.css";

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storage = getStorage();
  

  // copper state start
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("");

  const cropperRef = createRef();
  // copper state end

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const data = useSelector((state) => state.userLoginInfo.userInfo);
  // console.log(data);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        dispatch(userLoginInfo(null));
        localStorage.removeItem("user");
      })
      .catch((error) => {});
  };

  // recat cropper start
  const handlePPicture = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    console.log(files);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);

  };
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
       uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        //  console.log('Uploaded a data_url string!');
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL:downloadURL 
          })
          dispatch(userLoginInfo({...data, photoURL:downloadURL}))
          localStorage.setItem("user",JSON.stringify({...data, photoURL:downloadURL}))
          setShowModal(false)
        })
       });
    }
  };
  // recat cropper end
  return (
    <nav id="navbar" className="py-[5px]  bg-secodary">
      <div className="container mx-auto flex justify-between items-center">
        <div className="profileAndName">
          <div className="img relative group">
            <img src={data.photoURL} className="w-full rounded-full" alt="profile picture" />
            {/* <h2 className="defaultPPic">{data?.displayName[0]}</h2> */}
            <div
              onClick={() => setShowModal(true)}
              className="overlay hidden group-hover:block"
            >
              <RiUpload2Fill />
            </div>
          </div>
          <h2>{data?.displayName}</h2>
        </div>

        <div className="menu_items">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "text-tertinery" : "text-white"
            }
          >
            <IoMdHome />
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? "text-tertinery" : "text-white"
            }
          >
            <MdChat />
          </NavLink>
          <NavLink
            to="/notification"
            className={({ isActive }) =>
              isActive ? "text-tertinery" : "text-white"
            }
          >
            <MdNotifications />
          </NavLink>
        </div>
        <div className="logout_items cursor-pointer">
          <RiLogoutBoxRFill onClick={handleLogout} />
        </div>
      </div>

      {/* modal start */}
      {showModal && (
        <div className="modal">
          <div className="profileImg">
            <h2>Update your Profile picture</h2>
            <input onChange={handlePPicture} className="my-7" type="file" />
          
            <div className="h-[150px] w-[150px] mb-2 bg-red-500 rounded-full mx-auto overflow-hidden">
            <div className="img-preview w-full h-full" />
            {/* <img  src={data.photoURL ? "YOUR_DEFAULT_PROFILE_PICTURE_URL" : "img-preview"} alt="" /> */}
          </div>
           
            {image &&
             (

              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
                
              />
            )
         
            }

            <div>
              <div className="flex w-[50%] gap-6 mx-auto">
                <button onClick={getCropData} className="buttons_v_3 py-2">Upload</button>
                <button onClick={closeModal} className="buttons_v_4 py-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* modal end */}
    </nav>
  );
};

export default Navbar;
