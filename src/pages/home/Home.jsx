import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GroupList } from "../../components/GroupList";
import { UserList } from "../../components/UserList";
import { Friends } from "../../components/Friends";
import { FriendRequest } from "../../components/FriendRequest";
import { MyGroups } from "../../components/MyGroups";
import { BlockedUsers } from "../../components/BlockedUsers";

const Home = () => {
  const data = useSelector((state) => state.userLoginInfo.userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  });
  return (
    <div>
      <Navbar />

      {/* main content Start  */}
      <div className="main_content">
        {/* Group list start */}
        <div className="item">
          <GroupList />
        </div>
        {/* Group list end */}

        {/* Friends start */}
        <div className="item">
          <Friends />
        </div>
        {/* Friends end */}

        {/* User list start */}
        <div className="item">
          <UserList />
        </div>
        {/* User list end */}
        
        {/* Friend  Request start */}
        <div className="item">
          <FriendRequest />
        </div>
        {/* Friend  Request end */}

        {/* My Groups Start */}
        <div className="item">
          <MyGroups />
        </div>
        {/* My Groups end */}

        {/* Blocked Users end */}
        <div className="item">
          <BlockedUsers />
        </div>
        {/*Blocked Users Start */}
      </div>
      {/* main content end  */}
    </div>
  );
};

export default Home;
