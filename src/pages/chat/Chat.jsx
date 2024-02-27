
import Chatting from "../../components/Chatting"
import { Friends } from "../../components/Friends"
import GroupChat from "../../components/GroupChat"
import Navbar from "../../components/Navbar"

export const Chat = () => {
  return (
    <div>
        <Navbar/>
        <div className="flex container mx-auto justify-between">
           <div className="w-[30%]">
           <div className="chat">
               <div className="chat_item">
                    <Friends/>
                </div>
            </div>
                <div className="chat h-[400px]">
                <GroupChat/>
                </div>
           </div>
            <div className="w-[60%]">
             <Chatting/>
            </div>

        </div>
    </div>
  )
}
