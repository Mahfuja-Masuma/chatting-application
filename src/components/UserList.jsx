import { BsThreeDotsVertical } from "react-icons/bs";

import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import { list } from "firebase/storage";

export const UserList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  const [userList, setUserList] = useState([]);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  // get userList from users collection start
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setUserList(list);
    });
  }, []);

  // get userList from users collection end

  // friend request send start
  const handleFriendRequestSend = (item) => {
    set(push(ref(db, "friendRequest")), {
      senderId: data.uid,
      senderName: data.displayName,
      receverId: item.id,
      receverName: item.username,
    });
  };

  useEffect(() => {
    const friendRequestRef = ref(db, "friendRequest");
    onValue(friendRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().receverId + item.val().senderId);
      });
      setFriendRequestList(list);
    });
  }, []);
  // friend request send end

  // friend list data from friend collection satrt
  useEffect(() => {
    const friendListRef = ref(db, "friends");
    onValue(friendListRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().receverId + item.val().senderId);
      });

      setFriendList(list);
    });
  }, []);
  // friend list data from friend collection end

  // search start
  const handleSearch = (e) => {
    let array = [];
    userList.filter((item) => {
      if (
        item.username.toLowerCase().includes(e.target.value.toLocaleLowerCase())
      ) {
        array.push(item);
      }
    });
    setSearchUser(array);
  };
  // search end
  return (
    <div className="list mb-4">
      <div className="title">
        <h3>User List</h3>
        <input
          onChange={handleSearch}
          type="text"
          placeholder="search"
          className="input border border-secodary outline-none rounded-lg p-2 w-[300px]"
        />
        <BsThreeDotsVertical />
      </div>
      {
        
        searchUser.length>0
        ?
        searchUser.map((item, i) => {
          return (
            <div key={i} className="flex items-center gap-12 mb-3">
              <div className="flex items-center gap-4">
                <div className="img">
                  <ProfilePicture imgId={item.id} />
                </div>
                <div>
                  <h2>{item.username}</h2>
                  <p>{item.email}</p>
                </div>
              </div>
              <div>
                {friendList.includes(item.id + data.uid) ||
                friendList.includes(data.uid + item.id) ? (
                  <button className="buttons_v_3">Friend</button>
                ) : friendRequestList.includes(item.id + data.uid) ||
                  friendRequestList.includes(data.uid + item.id) ? (
                  <button className="buttons_v_3">Requset Send</button>
                ) : (
                  <button
                    onClick={() => handleFriendRequestSend(item)}
                    className="buttons_v_3"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          );
        })
        :
        userList.map((item, i) => {
          return (
            <div key={i} className="flex items-center gap-12 mb-3">
              <div className="flex items-center gap-4">
                <div className="img">
                  <ProfilePicture imgId={item.id} />
                </div>
                <div>
                  <h2>{item.username}</h2>
                  <p>{item.email}</p>
                </div>
              </div>
              <div>
                {friendList.includes(item.id + data.uid) ||
                friendList.includes(data.uid + item.id) ? (
                  <button className="buttons_v_3">Friend</button>
                ) : friendRequestList.includes(item.id + data.uid) ||
                  friendRequestList.includes(data.uid + item.id) ? (
                  <button className="buttons_v_3">Requset Send</button>
                ) : (
                  <button
                    onClick={() => handleFriendRequestSend(item)}
                    className="buttons_v_3"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          );
        })
      }

      
    </div>
  );
};
