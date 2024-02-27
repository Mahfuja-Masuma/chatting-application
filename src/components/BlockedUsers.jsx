import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";


export const BlockedUsers = () => {
  const [blockList,setBlockList] =useState([])
  const db = getDatabase()
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  useEffect(()=> {
 const blockRef= ref(db, 'block')
 onValue(blockRef,(snapshot) => {
  let list = []
  snapshot.forEach((item) => {
  if(data.uid == item.val().blockById){
    list.push({
      id:item.key,
      block:  item.val().block,
      blockId: item.val().blockId,
    })

  }
  else{
    list.push({
      id:item.key,
      blockBy:  item.val().blockBy,
      blockById: item.val().blockById,
    })
  }
  })

  setBlockList(list)
 })
  },[])

  // Unblock start
  const handleUnblock = (item)=> {
    set(push(ref(db,'friends')), {
      senderId: item.blockId,
      senderName: item.block,
      receverId: data.uid,
      receverName: data.displayName,
    })
    .then(()=> {
      remove(ref(db,'block/'+ item.id))
    })
  }
  // Unblock end
  return (
    <div className="list mb-4">
      <div className="title">
        <h3>Blocked Users</h3>
        <BsThreeDotsVertical />
      </div>
 <div>
  {
    blockList.length==0?
    <h1 className="text-center font-bold text-red-400 text-2xl ml-[100px] mt-5 capitalize">Block User empty Now</h1>
    :
    blockList.map ((item,i) => {
      return(
        <div key={i}  className="flex items-center gap-12 mb-3">
        <div className="flex items-center gap-4">
            <div className="img">

            </div>
            <div className="">
            
              <h2>{item.block? item.block : item.blockBy}</h2>
              <p>Today, 8:56pm </p>
            </div>
          </div>
          <div>
            {
              item.blockById?
              <button className="buttons_v_4">you are blocked</button>
              :
            <button onClick={()=> handleUnblock(item)} className="buttons_v_5">Unblock</button>
            }
          </div>
        </div>
      )
    })
  }


 </div>
 </div>
   
  );
};
