import Lottie from "lottie-react";
import registration from "../../../public/animation/registration.json";
import { Buttons_v_1 } from "../../components/Buttons";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getDatabase, ref, set } from "firebase/database";
import { Circles } from "react-loader-spinner";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  // input information start
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassord] = useState("");
  // input information end

  // Loader start
  const [loader, setLoader] = useState(false);
  // Loader end

  // input feild error message start
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  // input feild error message start

  // show password start
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowRePassword = () => {
    setShowRePassword(!showRePassword);
  };
  // show password end

  // get input value start
  const handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };
  const handleRePassword = (e) => {
    setRePassord(e.target.value);
    setRePasswordError("");
  };
  // get input value end

  // email name regex start
  const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const namereg = /^[a-zA-Z]+$/;
  // email name  regex end

  // registration start
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) {
      setFullNameError("Fullname is required");
    }
    if (!namereg.test(fullName)) {
      setFullNameError("Fullname is not Valid");
    }
    if (!email) {
      setEmailError("Email is required");
    }
    if (!regEmail.test(email)) {
      setEmailError("Email is Invalid");
    }
    if (!password) {
      setPasswordError("Password is required");
    }
    if (!rePassword) {
      setRePasswordError("Repassword is required");
    }
    if (password !== rePassword) {
      setRePasswordError("password is not match");
    }

    // firebase registration start
    if (
      fullName &&
      namereg.test(fullName) &&
      email &&
      regEmail.test(email) &&
      password &&
      rePassword &&
      password === rePassword
    ) {
      setLoader(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL:"https://ionicframework.com/docs/img/demos/avatar.svg",
          })
            .then(() => {
              // Profile updated!
              const user = userCredential.user;
              console.log(user)
              toast.success("Registration successfully");
              setLoader(false);
              navigate("/");
            })
            .then(()=>{
              set(ref(db, 'users/' + auth.currentUser.uid), {
                username: fullName,
                email: email,
              
              });
            })
           
            .catch((error) => {
              console.log(error)
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage.includes("auth/email-already-in-use")) {
            setEmailError("Email is already in use");
            toast.error("Email is already in use");
          }
          setLoader(false);
        });
    }
    // firebase registration end
  };
  // registration end

  return (
    <div className="registration bg-primary  ">
      <div data-aos className="pt-[50px]">
        <h1 data-aos="fade-up" data-aos-duration="3000" className="heading">
          {/* Wellcom to Talk-Mixer{" "} */}
          Registration Here
        </h1>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-[50%] mb-8 md:mb-0">
          <h1></h1>
          <Lottie animationData={registration} className="w-full" />
        </div>
        <div className="w-full md:w-[40%] registration-form">
          <form onSubmit={handleSubmit} className="inputs">
            <input
              onChange={handleFullName}
              value={fullName}
              type="text"
              placeholder="Full name"
            />
            <p className="error-message">{fullNameError}</p>
            <input
              onChange={handleEmail}
              value={email}
              type="text"
              placeholder="Enter your Email"
            />
            <p className="error-message">{emailError}</p>
            <div className="relative">
              <input
                onChange={handlePassword}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              {showPassword ? (
                <FaEye
                  onClick={handleShowPassword}
                  className="absolute right-5 top-[50%] text-xl cursor-pointer text-secodary translate-y-[-50%]"
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className="absolute right-5 top-[50%] text-xl cursor-pointer text-secodary translate-y-[-50%]"
                />
              )}
            </div>
            <p className="error-message">{passwordError}</p>
            <div className="relative">
              <input
                onChange={handleRePassword}
                value={rePassword}
                type={showRePassword ? "text" : "password"}
                placeholder="Re-enter paaword"
              />
              {showRePassword ? (
                <FaEye
                  onClick={handleShowRePassword}
                  className="absolute right-5 top-[50%] text-xl cursor-pointer text-secodary translate-y-[-50%]"
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowRePassword}
                  className="absolute right-5 top-[50%] text-xl cursor-pointer text-secodary translate-y-[-50%]"
                />
              )}
            </div>
            <p className="error-message">{rePasswordError}</p>
            {loader ? (
              <div className="flex justify-center ">
                {" "}
                <Circles color="blue" />
              </div>
            ) : (
              <Buttons_v_1>Sign up</Buttons_v_1>
            )}

            <div className="text-sm mt-5 font-poppins">
              <p>
                Already have an account please.{" "}
                <Link className="font-bold text-tertinery" to="/">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
