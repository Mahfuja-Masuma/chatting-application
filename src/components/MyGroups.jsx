import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfilePicture from "./ProfilePicture";

export const MyGroups = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const [groupList, setGroupList] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [errorGroupName, setErrorGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupName, setGroupName] = useState(""); 
  const [groupJoinRequestList, setGroupJoinRequestList] = useState([]);
  const[groupMember, setGroupmember]= useState([])
  const[searchMyGroup, setSearchMyGroup]= useState([])
  // Get my groups from collection start
  useEffect(() => {
    const groupRef = ref(db, "group");
    onValue(groupRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid === item.val().adminId) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);
  // Get my groups from collection end

  // Delete my group start
  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setErrorGroupName("");
  };

  const handleGroupDelete = (item) => {
    setShowDelete(true);
    setSelectedGroupId(item.id);
  };

  const handleSubmit = () => {
    if (groupName.trim() === "") {
      setErrorGroupName("Group name is required");
      return;
    }

    const groupToDelete = groupList.find((group) => group.groupName === groupName);
    if (!groupToDelete) {
      setErrorGroupName("Group not found");
      return;
    }

    remove(ref(db, `group/${groupToDelete.id}`)).then(() => {
      toast.success("Group deleted successfully");
      setGroupName("");
      setShowDelete(false);
    });
  };
  // Delete my group end

  // Show request my group start
  const handleShowRequest = (group) => {
    setGroupName(group.groupName);
    setShowRequest(true);
  
    const groupRequestRef = ref(db, "groupJoinRequest");
  
    onValue(groupRequestRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminId && item.val().groupId == group.id) { // Change group.key to group.id
          list.push({ ...item.val(), key: item.key});
        }
      });
      setGroupJoinRequestList(list);
     
    });
  };


  // Show request my group end

  
  // group request accept start
  const handleShowRequestAccept = (item)=>{
    set(push(ref(db, "groupMembers")), {
     groupId: item.groupId,
     groupName: item.groupName,
     adminId: item.adminId,
     adminName: item.adminName,
     userId: item.userId,
     userName: item.userName,
    })
    .then(() => {
      remove(ref(db,"groupJoinRequest/" + item.key))
    })
   }
   // group request accept end
 
   
   // group request reject start
   const handleShowRequestReject =((item)=> {
     remove(ref(db,"groupJoinRequest/" + item.key))
   })
   // group request reject end

   // show group request info start
   const handleShowGroupRequestInfo= (itemInfo)=> {
    setGroupName(itemInfo.groupName);
    setShowGroupInfo(true)

    const groupMembersRef = ref(db, "groupMembers");
    onValue(groupMembersRef, (snapshot) => {
      const list=[]
      snapshot.forEach((item)=> {
         if(data.uid == itemInfo.adminId && item.val().groupId == itemInfo.id){
          list.push({...item.val(), key: item.key})

         }
      })
      setGroupmember(list)
    })
    console.log(groupMember)
   }
   // show group request info end

   // show group  info band start
   const handleShowInfoBand=((item)=> {
    remove(ref(db,"groupMembers/" + item.key))
   })
   // show group  info band end


     // search start
  const handleSearchMyGroup = (e) => {
    let array = [];
    groupList.filter((item) => {
      if (
        item.groupName.toLowerCase().includes(e.target.value.toLocaleLowerCase())
      ) {
        array.push(item);
      }
    });
    setSearchMyGroup(array);
  };
  // search end


   return (
    <div className="list mb-4">
      <div className="title">
        <h3>My Groups</h3>
        <input
          onChange={handleSearchMyGroup}
          type="text"
          placeholder="search"
          className="input border border-secodary outline-none rounded-lg p-2 w-[300px]"
        />
        <BsThreeDotsVertical />
      </div>
  
      {showRequest ? (
        <div className="bg-secodary w-full rounded-lg p-10 relative">
          <button onClick={() => setShowRequest(false)} className="buttons_v_2 absolute w-auto right-2 top-2">
            Close
          </button>
          <h1 className="text-2xl font-bold text-blue-600 mb-5">{groupName}</h1>
          {
            groupJoinRequestList.map((item,i)=>{
              return(
                <div key={i} className="flex items-center justify-between mb-9 bg-white rounded-lg p-4 mt-4">
                 <div className="flex gap-5 items-center">
                 <div className="h-[50px] w-[50px] sm:h-[65px] sm:w-[65px] rounded-full overflow-hidden bg-five flex justify-center items-center">
                    <ProfilePicture imgId={item.userId}/>
                  </div>
                  <div>
                    <h3 className="text-2xl text-blue-700  font-bold">{item.userName}</h3>    
                    <h3 className="text-base text-black  ">{item.groupIntro}</h3>    
                  </div>
                 </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleShowRequestAccept(item)} className="buttons_v_5 mb-1">
                      Accept
                    </button>
                    <button onClick={() => handleShowRequestReject(item)} className="buttons_v_4">
                      Reject 
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      ) : showDelete ? (
        <div className="bg-secodary w-auto rounded-lg p-10 relative">
          <button onClick={() => setShowDelete(false)} className="buttons_v_2 absolute w-auto right-2 top-2">
            Close
          </button>
          <h1>Your Group Name is: {groupList.find((group) => group.id === selectedGroupId)?.groupName}</h1>
          <input
            value={groupName}
            onChange={handleGroupName}
            type="text"
            placeholder="Type group name"
            className="outline-none rounded-lg p-4"
          />
          {errorGroupName && <p className="text-red-500">{errorGroupName}</p>}
          <button onClick={handleSubmit} className="buttons_v_3 mt-2">
            Submit
          </button>
        </div>
      ) : 
        showGroupInfo?
        <div className="bg-secodary w-full rounded-lg p-10 relative ">
        <button onClick={() => setShowGroupInfo(false)} className="buttons_v_2 absolute w-auto right-2 top-2">
          Close
        </button>
        <h1 className="text-2xl font-bold text-blue-600 mb-5">{groupName}</h1>
        {
          groupMember.map((item,i)=>{
            return(
              <div key={i} className="flex items-center justify-between mb-9 bg-white rounded-lg p-4 mt-4">
               <div className="flex gap-5 items-center">
               <div className="h-[50px] w-[50px] sm:h-[65px] sm:w-[65px] rounded-full overflow-hidden bg-five flex justify-center items-center">
                  <ProfilePicture imgId={item.userId}/>
                </div>
                <div>
                  <h3 className="text-2xl text-blue-700 font-bold">{item.userName}</h3> 
                  <h3 className="text-base text-black ">{item.groupIntro}</h3>    
                </div>
               </div>
                <div className="flex gap-3">
                 
                  <button onClick={() => handleShowInfoBand(item)} className="buttons_v_4">
                    Band 
                  </button> 
                </div>
              </div>
            )
          })
        }
      </div>

        :
      
        groupList.length === 0 ? 
          <h1 className="text-center font-bold text-red-400 text-2xl ml-[100px] mt-5">No Group Available Now</h1>
         : 
          searchMyGroup.length>0
          ?
          searchMyGroup.map((item, i) => (
            <div key={i} className="flex items-center gap-7 mb-6 ">
              <div className="img flex justify-center items-center">
                <h3 className="font-bold uppercase text-blue-700 text-2xl">{item.groupName[0]}</h3>
              </div>
              <div>
                <h3 className="text-sm text-red-600 font-bold">Admin: {item.adminName}</h3>
                <h3 className="font-bold text-blue-700 ">{item.groupName}</h3>
                <p>{item.groupIntro} </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleShowGroupRequestInfo(item)} className="buttons_v_3 mb-1">Info</button>
                <button onClick={() => handleShowRequest(item)} className="buttons_v_5 mb-1">
                  Request
                </button>
                <button onClick={() => handleGroupDelete(item)} className="buttons_v_4">
                  Delete
                </button>
              </div>
            </div>
          ))
          :
          groupList.map((item, i) => (
            <div key={i} className="flex items-center gap-7 mb-6 ">
              <div className="img flex justify-center items-center">
                <h3 className="font-bold uppercase text-blue-700 text-2xl">{item.groupName[0]}</h3>
              </div>
              <div>
                <h3 className="text-sm text-red-600 font-bold">Admin: {item.adminName}</h3>
                <h3 className="font-bold text-blue-700 ">{item.groupName}</h3>
                <p>{item.groupIntro} </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleShowGroupRequestInfo(item)} className="buttons_v_3 mb-1">Info</button>
                <button onClick={() => handleShowRequest(item)} className="buttons_v_5 mb-1">
                  Request
                </button>
                <button onClick={() => handleGroupDelete(item)} className="buttons_v_4">
                  Delete
                </button>
              </div>
            </div>
          ))
        
      }
    </div>
  );
  
};
