import { BsEmojiLaughing } from "react-icons/bs";
import { GrGallery } from "react-icons/gr";
import { AiFillAudio } from "react-icons/ai";
import ModalImage from "react-modal-image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
const image = "https://png.pngtree.com/thumb_back/fh260/background/20230519/pngtree-landscape-jpg-wallpapers-free-download-image_2573540.jpg"
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EmojiPicker from "./EmojiPicker";


const Chatting = () => {
  const storage = getStorage();
  const db = getDatabase()
  const activeChatName = useSelector((state) => state.activeChatSlice);
  const data = useSelector((state) => state.userLoginInfo.userInfo); 
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const [errorMessage, setErrorMessage] = useState("");

  // Handle message send part start
  const handleMessageSend = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    
    if (activeChatName.active.status === "single") {
      if (message.trim() !== "") {
        set(push(ref(db, 'singleMessage')), {
          whoSendId: data.uid,
          whoSendName: data.displayName,
          whoReceiveId: activeChatName.active.id,
          whoReceiveName: activeChatName.active.name,
          msg: message,
          date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()},${new Date().getHours() % 12 || 12}:${new Date().getMinutes()} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
        })
        .then(() => {
          console.log("Message sent successfully");
          setMessage("");
          setErrorMessage(""); // Clear error message
        })
        .catch((error) => {
          console.log("Error sending message:", error);
          // Display error message to the user
          setErrorMessage("Error sending message. Please try again later.");
        });
      } else {
        // Display error message for empty message
        setErrorMessage("Please type a message before sending.");
      }
    }
  };


  useEffect(()=> {
  onValue(ref(db, 'singleMessage'), (snapshot)=> {
    let arr=[]
    snapshot.forEach((item)=> {
      if(item.val().whoSendId==data.uid && item.val().whoReceiveId==activeChatName.active.id || item.val().whoReceiveId==data.uid && item.val().whoSendId==activeChatName.active.id){
      arr.push(item.val())
      }

    })
    setMessageList(arr)
  })
  },[activeChatName.active.id])
  // Handle message send part end

  // images send from gellery start
  const handleSendImg=(e)=> {
    const storageRef = sref(storage, e.target.files[0].name);

const uploadTask = uploadBytesResumable(storageRef,  e.target.files[0]);

uploadTask.on('state_changed', 
  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, 
  (error) => {
    console.log(error)
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

      set(push(ref(db, 'singleMessage')), {
        whoSendId: data.uid,
        whoSendName: data.displayName,
        whoReceiveId: activeChatName.active.id,
        whoReceiveName: activeChatName.active.name,
        img: downloadURL,
        date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()},${new Date().getHours()%12||12}:
        ${new Date().getMinutes()} ${new Date().getHours() >= 12 ? "PM" : "AM"}`,

      })
 
    });
  }
);


  }
  // images send from gellery end

  // send emoji start
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSelectEmoji = (emoji) => {
    // Handle the selected emoji (e.g., insert it into the message input field)
    setMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };
  // send emoji end

  return (
    <div className="relative h-96 overflow-y-scroll rounded-lg mt-3 border-2 border-secodary px-6">
      {/* identify start */}

      <div className="sticky z-10 top-0 left-0 flex gap-5 items-center bg-white  border-b p-2 mb-2 border-b-secodary">
        <div className="h-[80px] w-[80px]  overflow-hidden bg-secodary rounded-full">
          <img src="" alt="" />
        </div>
        <div>
          <h2 className="text-base font-bold capitalize">{activeChatName.active?.name}</h2>
          <p>Online</p>
        </div>
      </div>

      {/* identify end */}



{
 activeChatName.active.status == "single"
 ?
 (
  messageList.map((item,i)=>{
    return(
      item.whoSendId == data.uid?
    (
      item.msg?
        //  send message start
        <div key={i} className="text-right my-4">
        <div className="inline-block px-3 py-1 rounded-lg bg-secodary">
          <p className="text-white text-left">{item.msg}</p>
        </div>
        <p className="text-gray-400 mt-1">{item.date}</p>
      </div>
      //  send message end
      :
      // send picture start
      <div className="text-right my-4">
      <div className="inline-block p-1 rounded-lg bg-secodary">
        <ModalImage className="h-[300px] rounded-[4px]"  small={item.img} large={item.img} alt={item.img} />
      </div>
      <p className="text-gray-400 mt-1">{item.date}</p>
    </div>
    //  send picture end 
    )
      :
    (
      item.msg?
        // receive message start
        <div key={i} className="text-left">
        <div className="inline-block px-3 py-1 rounded-lg bg-gray-300">
          <p>{item.msg}</p>
        </div>
        <p className="text-gray-400 mt-1 text-left">{item.date}</p>
      </div>
      //  receive message end 
      :
      // receive picture start 
      <div className="text-left">
      <div className="inline-block p-1 rounded-lg bg-gray-300">       
        <ModalImage className="h-[300px] rounded-[4px]"  small={item.img} large={item.img} alt={item.img}/>
        <img  alt="" />
      </div>
      <p className="text-gray-400 mt-1 text-left">11.33</p>
    </div>
    //  receive picture end

    )
    )

  })
 )
 :
 <h1>Group</h1>
}



     

          {/* receive audio start */}
          {/* <div className="text-left">
        <div className="inline-block p-1 rounded-[100px] bg-gray-300">
         <audio controls></audio>
        </div>
        <p className="text-gray-400 mt-1 text-left">11.33</p>
      </div> */}
      {/* receive audio end */}

      {/* send audio start */}
      {/* <div className="text-right my-4">
      <div className="inline-block p-1 rounded-[100px] bg-secodary">
         <audio controls></audio>
        </div>
        <p className="text-gray-400 mt-1">11.33</p>
      </div> */}
      {/* send audio end */}

          {/* receive video start */}
          {/* <div className="text-left">
        <div className="inline-block p-1 rounded-lg bg-gray-300">
         <video className="rounded-[4px]" controls></video>
        </div>
        <p className="text-gray-400 mt-1 text-left">11.33</p>
      </div> */}
      {/* receive video end */}

      {/* send video start */}
      {/* <div className="text-right my-4">
      <div className="inline-block p-1 rounded-lg bg-secodary">
         <video className="rounded-[4px]" controls></video>
        </div>
        <p className="text-gray-400 mt-1">11.33</p>
      </div> */}
      {/* send video end */}


      {/* ============send message part satrt==================== */}
     
      <form onSubmit={handleMessageSend}>
        <div className="w-full bg-white flex justify-between gap-5 items-center sticky left-0 bottom-0 ">
          <div className="flex justify-between items-center rounded-lg gap-5 bg-gray-200 w-full">
            <div className="w-full">
              <input 
                onChange={(e) => setMessage(e.target.value)} 
                value={message} 
                type="text" 
                placeholder="Type a message" 
                className="input p-2 border border-secodary outline-none w-full rounded-lg" 
              />
              {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            </div>
      
            <div className="flex gap-2 items-center">
        <button className="" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <BsEmojiLaughing className="text-[27px] text-tertinery" />
        </button>
        {showEmojiPicker && (
          <div className="cursor-pointer">
            <EmojiPicker onSelectEmoji={handleSelectEmoji} />
          </div>
        )}
        <button className=""><AiFillAudio className="text-[27px] text-tertinery" /></button>
        <label>
          <input onChange={handleSendImg} type="file" className="hidden" />
          <GrGallery className="text-3xl text-tertinery mr-5" />
        </label>
      </div>


          </div>
          <div>        
            <button type="submit" className="bg-secodary rounded-lg px-4 py-3 font-bold">Send</button>
          </div>
        </div>
      </form>
      {/* ============send message part end====================== */}

    </div>
  );
};

export default Chatting;
