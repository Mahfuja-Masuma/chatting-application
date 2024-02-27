import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Buttons_v_1 } from "../../components/Buttons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Forgotpassword = () => {
    const auth = getAuth();
 const [email, setEmail] =useState("")
 const [emailError, setEmailError] =useState("")

 const handleEmail =(e) => {
    setEmail(e.target.value)
    setEmailError("")

 }
 const handleSubmit =(e)=> {
    e.preventDefault()
    if(!email){
        setEmailError("Email is required")
    }
    else{
        sendPasswordResetEmail(auth, email)
        .then(() => {
         toast.success("Email Send ")
        })
        .catch((error) => {
            console.log(error.message)
        //   toast.error(error.message)
        if(error.message === "Firebase: Error (auth/user-not found)."){
            setEmailError("")
            toast.error("User Not Found")
        }
        });
    }

 }

  return (
    <div id="forgotpassword" className="h-screen bg-secodary flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[500px] p-10 rounded-lg bg-primary">
       <h1>Forgot Password</h1>
       <div>
        <input onChange={handleEmail} type="email" placeholder="Enter your Email" />
        <p className="error-message">{emailError}</p>
        <div className="flex justify-between gap-5">
         <Buttons_v_1>
            <Link to='/login'>Back to login</Link>
         </Buttons_v_1>
         <Buttons_v_1>Send</Buttons_v_1>
        </div>
       </div>
        </form>
        
    </div>
  )
}

export default Forgotpassword