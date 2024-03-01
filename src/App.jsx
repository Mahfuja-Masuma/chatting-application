
import './App.css'
import SignUp from './pages/registration/SignUp'
import Login from './pages/login/Login'
import firebaseConfig from './firebase.config'
import { Routes,Route } from "react-router-dom";
import Home from './pages/home/Home';
import Forgotpassword from './pages/forgotpassword/Forgotpassword';
import { Chat } from './pages/chat/Chat';


function App() {

  return (
<div>

 <Routes>
 <Route path="/" element={<Login/>}/>
 <Route path="/signup" element={<SignUp/>}/>
 <Route path="/forgotpassword" element={<Forgotpassword/>}/>
 <Route path="/home" element={<Home/>}/>
 <Route path="/chat" element={<Chat/>}/>
 </Routes>
</div>
  )
}

export default App
