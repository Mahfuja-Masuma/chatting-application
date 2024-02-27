import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const GroupChat = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLoginInfo.userInfo);

  //get input value
const[groupList, setGroupList]= useState([])
const[searchGroupList, setSearchGroupList]= useState([])


 


  // get group list start
  useEffect(()=>{
    const groupRef=ref(db,"group")
    onValue(groupRef,(snapshot)=> {
      let list=[]
    snapshot.forEach((item)=> {
        list.push({...item.val(), id: item.key})
    });
    setGroupList(list)

    })
  },[])
  // get group list end



  return (
    <div className="list mb-4">
      <div className="title flex gap-12 mb-5">
        <h3 className="text-lg sm:text-2xl font-medium text-tertinery mt-2">Group List</h3>  
      </div>

   {
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
                <button  className="buttons_v_3">Message</button>
              </div>
            </div>
            )
          }) 
      
      }
    </div>
  );
};



export default GroupChat