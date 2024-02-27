import { BsThreeDotsVertical } from "react-icons/bs";
import { Buttons_v_3, Buttons_v_4 } from "./Buttons";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";

export const FriendRequest = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
 

  let [friendRequestList, setFriendRequestList] = useState([]);

  // get friend request list from friend request collection start
  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    let list = [];
    onValue(friendRequestRef, (snapshot) => {
      list = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.receverId === data.uid) {
          list.push({ ...request, id: item.key });
        }
      });

      setFriendRequestList(list);
    });
  }, []);
  // get friend request list from friend request collection end

  // get friend request accept start
  const handleFriendRequestAccept= (item) => {
    set(push(ref(db,'friends')), {
      ...item
    }) .then(()=> {
      remove(ref(db, 'friendRequest/' + item.id))
    })

  }
  // get friend request cancle end

  // get friend request accept start
  const handleFriendRequestCancle= (item) => {
      remove(ref(db, 'friendRequest/' + item.id))
 

  }
  // get friend request cancle end

  return (
    <div className="list mb-4">
      <div className="title">
        <h3> Friend Request</h3>
        <BsThreeDotsVertical />
      </div>

      <div>
        {
          friendRequestList.length==0?
          <h1 className="text-center font-bold text-red-400 text-2xl ml-[40px] mt-5 capitalize">your friend request is empty Now</h1>
          :
          friendRequestList.map((item) => {
            return (
              <div key={item.id} className="flex items-center gap-9 mb-3">
                <div className="flex items-center gap-4">
                  <div className="img">
                    <ProfilePicture imgId={item.senderId} />
                  </div>
                  <div className="">
                    <h2>{item.senderName}</h2>
                    <p>Dinner! </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleFriendRequestAccept(item)} className="buttons_v_3">Accept</button>
                  <button onClick={() => handleFriendRequestCancle(item)}  className="buttons_v_4">Cancel</button>
                </div>
              </div>
            );
          })
        }
      
      </div>
    </div>
  );
};
