
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import ProfilePicture from './ProfilePicture';
import { activeChat } from '../slices/activeChatSlice';


export const Friends = () => {

  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo); 
  const dispatch = useDispatch()
  const[friendList, setFriendList] = useState([])


  // get friend list from friends collection start
 useEffect(()=> {
  const friendRef = ref(db,'friends')
  onValue(friendRef, (snapshot)=> {
    const list=[]
    snapshot.forEach((item) => {
      if(data.uid == item.val().receverId || data.uid == item.val().senderId){
        list.push({...item.val(), id: item.key})

      }

    })
    setFriendList(list)
  })
 },[])

  // get friend list from friends collection end 


  // block start
  const handleBlock=(item)=> {
    if(data.uid == item.senderId){
      set(push(ref(db, 'block')),{
        block: item.receverName,
        blockId: item.receverId,
        blockBy: item.senderName,
        blockById: item.senderId,
      })
      .then(()=>{
        remove(ref(db, 'friends/' +item.id))
      })

    }
    else{
      set(push(ref(db, 'block')),{
        block: item.senderName,
        blockId: item.senderId,
        blockBy: item.receverName,
        blockById: item.receverId,
      })
      .then(()=>{
        remove(ref(db, 'friends/' +item.id))
      })
    }
  }
  // block end

  // unfriend start
  const handleUnfriend = (item) => {
    const confirmUnfriend = window.confirm("Are you sure you want to unfriend this user?");
    if (confirmUnfriend) {
      remove(ref(db, 'friends/' + item.id))
    }
  }
  // unfriend end

//  Handle Active friend for chat satrt
const handleActiveFriend = (item)=> {
  if(item.receverId == data.uid){
    dispatch(activeChat({status: "single", id: item.senderId, name: item.senderName}))
    localStorage.setItem("activeFriend", JSON.stringify({status: "single", id: item.senderId, name: item.senderName}))
  }
  else{
    dispatch(activeChat({status: "single", id: item.receverId, name: item.receverName}))
    localStorage.setItem("activeFriend", JSON.stringify({status: "single", id: item.receverId, name: item.receverName}))
  }
}
//  Handle Active friend for chat end

  return (
    <div className='list mb-4'>
       <div className="title">
            <h3>Friends</h3>
            <BsThreeDotsVertical/>
          </div>
  
  <div>
    {
      friendList.length==0?
      <h1 className="text-center font-bold text-red-400 text-2xl ml-[100px] mt-5 capitalize">Now you have no friends</h1>
      :
      friendList.map((item) => {
        return(
          <div onClick={()=> handleActiveFriend(item)} key={item.id} className='cursor-pointer flex items-center gap-3 mb-3'>
          <div className='flex items-center gap-4'>
            <div className='img'>
            <ProfilePicture imgId={data.uid === item.senderId ? item.receverId : item.senderId} />

            </div>
               <div className=''>
               <h2>{data.uid === item.senderId ? item.receverName : item.senderName}</h2>
                   <p>Good to see you. </p>
               </div>
            </div>
               <div className='flex gap-1'>
                   <button onClick={()=> handleUnfriend(item)}  className='buttons_v_3'>Unfriend</button>
                   <button onClick={()=> handleBlock(item)} className='buttons_v_4'>Block</button>
               </div>
          </div>
        )
      })
    }
  
  </div>
    </div>
  )
}
