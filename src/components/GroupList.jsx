import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const GroupList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  // Show input value
  const [show, setShow] = useState(false);

  //get input value
const[groupList, setGroupList]= useState([])
const[searchGroupList, setSearchGroupList]= useState([])

  // create group start

  const [groupName, setGroupName] = useState("");
  const [groupIntro, setGroupIntro] = useState("");
  const [errorGroupName, setErrorGroupName] = useState("");
  const [errorGroupIntro, setErrorGroupIntro] = useState("");

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setErrorGroupName("");
  };
  const handleGroupIntro = (e) => {
    setGroupIntro(e.target.value);
    setErrorGroupIntro("");
  };

  const handleCreateGroup = () => {
    if (groupName == "") {
      setErrorGroupName("Group Name is Requried");
    } else if (groupIntro == "") {
      setErrorGroupIntro("Group Name is Requried");
    } else {
      set(push(ref(db, "group")), {
        groupName: groupName,
        groupIntro: groupIntro,
        adminName: data.displayName,
        adminId: data.uid,
      }) 
       .then(() => {
        toast.success("Group Create Successfully");
        setShow(false);
        setGroupName("")
        setGroupIntro("")
      });
    }
  };

  // create group end


  // get group list start
  useEffect(()=>{
    const groupRef=ref(db,"group")
    onValue(groupRef,(snapshot)=> {
      let list=[]
    snapshot.forEach((item)=> {
      if(data.uid != item.val().adminId){
        list.push({...item.val(), id: item.key})
      }
    });
    setGroupList(list)

    })
  },[])
  // get group list end

  // join group start
const handleJoinGroup = (item)=> {
  set(push(ref(db, "groupJoinRequest")), {
    groupId:item.id,
    groupName:item.groupName,
    adminId:item.adminId,
    adminName:item.adminName,
    groupIntro:item.groupIntro,
    userId:data.uid,
    userName:data.displayName
  }).then(()=>{
    toast.success("Request Send")
  })
}
  // join group end

    // search start
    const handleSearchGroupList = (e) => {
      let array = [];
      groupList.filter((item) => {
        if (
          item.groupName.toLowerCase().includes(e.target.value.toLocaleLowerCase())
        ) {
          array.push(item);
        }
      });
      setSearchGroupList(array);
    };
    // search end

  return (
    <div className="list mb-4">
      <div className="title">
        <h3>Group List</h3>
        <input
          onChange={handleSearchGroupList}
          type="text"
          placeholder="search"
          className="input border border-secodary outline-none rounded-lg p-2 w-[200px]"
        />
        <button onClick={() => setShow(!show)} className="buttons_v_6 w-auto">
          {show ? "Cancel" : "Create Group"}
        </button>
       
      </div>

      {show ? 
        <div className="bg-blue-500 p-4 rounded-lg">
          <input
            onChange={handleGroupName}
            type="text"
            className="w-full p-2 outline-none rounded-lg mb-3"
            placeholder="Group Name"
          />
          <p className="text-red-600">{errorGroupName}</p>
          <input
            onChange={handleGroupIntro}
            type="text"
            className="w-full p-2 outline-none rounded-lg"
            placeholder="Group Intro"
          />
          <p className="text-red-600">{errorGroupIntro}</p>
          <button onClick={handleCreateGroup} className="buttons_v_5 py-2 mt-4">
            Create
          </button>
        </div>
       : 
      searchGroupList.length>0
      ?
      searchGroupList.map((item,i)=>{
        return(
          <div key={i} className="flex items-center gap-12 mb-3">
          <div className="flex items-center gap-4">
            <div className='img flex justify-center items-center'>
            <h3 className="font-bold uppercase text-blue-700 text-2xl">{item.groupName[0]}</h3>
            </div>
            <div className="">
              <h3 className="text-five font-bold">Admin: {item.adminName}</h3>
              <h3 className="font-bold text-blue-700 text-lg ">{item.groupName}</h3>
              <p>{item.groupIntro} </p>
            </div>
          </div>
          <div>
            <button onClick={()=> handleJoinGroup(item)} className="buttons_v_3">Join</button>
          </div>
        </div>
        )
      }) 
      :
        groupList.map((item,i)=>{
            return(
              <div key={i} className="flex items-center gap-12 mb-3">
              <div className="flex items-center gap-4">
                <div className='img flex justify-center items-center'>
                <h3 className="font-bold uppercase text-blue-700 text-2xl">{item.groupName[0]}</h3>
                </div>
                <div className="">
                  <h3 className="text-five font-bold">Admin: {item.adminName}</h3>
                  <h3 className="font-bold text-blue-700 text-lg ">{item.groupName}</h3>
                  <p>{item.groupIntro} </p>
                </div>
              </div>
              <div>
                <button onClick={()=> handleJoinGroup(item)} className="buttons_v_3">Join</button>
              </div>
            </div>
            )
          }) 
      
      }
    </div>
  );
};
