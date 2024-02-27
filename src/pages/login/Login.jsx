import Lottie from "lottie-react";
import login from "../../../public/animation/login.json";
import { Buttons_v_1 } from "../../components/Buttons";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Circles } from 'react-loader-spinner'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

const Login = () => {

  // redux dispatch start
  const dispatch = useDispatch()
  // redux dispatch end
  const auth = getAuth();
  const navigate = useNavigate()

  // input information start
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // input information end

  // Loader start
  const [loader, setLoader] =useState(false)
  // Loader end

  // input feild error message start

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // input feild error message start

  // show password start
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // show password end

  // get input value start
 
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  // get input value end

  // email name regex start
  const regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
  // email name  regex end

  // login start
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!email) {
      setEmailError("Email is required");
    }
   else if (!regEmail.test(email)) {
      setEmailError("Email is not valid");
    }
   else if (!password) {
      setPasswordError("Password is required");
    }
  

    // firebase login start
   else{
    setLoader(true)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        toast.success("Login successfully")        
        setLoader(false)
        dispatch(userLoginInfo(user))
        localStorage.setItem("user",JSON.stringify(user))
        navigate("/home")
      })
      .catch((error) => {
        setLoader(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("User Not Found")
        console.log(errorCode)
    // if(errorMessage===("auth/wrong-password")){
    //     setPasswordError("Wrong Password ")
    //     toast.error("Wrong Password")
    // }
    // else if(errorMessage===("auth/user-not-found")){
    //     setEmailError("User Not Found")
    //     toast.error("User Not Found")
    // }
      });   
   }
    // firebase login end
  };
  // login end

  return (
    <div className="registration bg-primary  ">
      
      <div data-aos className="pt-[50px]">
        <h1 data-aos="fade-up" data-aos-duration="3000" className="heading">
          Wellcom to Talk-Mixer{" "}
          
        </h1>
      </div>

      <div
         className="container mx-auto flex flex-col md:flex-row justify-between items-center"
      >
        <div className="w-full md:w-[50%] mb-8 md:mb-0">
       
          <Lottie animationData={login} className="w-full" />
        </div>
        <div className="w-full md:w-[40%] registration-form">
            <div className="form-heading"><h2>Login Here</h2></div>

          <form  onSubmit={handleSubmit} className="inputs">
           
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
        
           
            {
              loader ?
             <div className="flex justify-center "> <Circles color="blue" /></div>
              :
            <Buttons_v_1>Login</Buttons_v_1>
            }

            <div className="flex justify-between "><p className="text-sm mt-5 font-poppins">New here ? Please. 
                <Link className="font-bold text-tertinery" to="/signup">Registration</Link>
                </p>
                <Link className="font-bold text-tertinery items-center  text-sm capitalize" to="/forgotpassword">Forgot Password</Link>
                </div>
          </form>
        </div>
      </div> 
    </div>
  );
};

export default Login;
