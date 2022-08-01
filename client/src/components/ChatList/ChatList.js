import {React, useEffect, useState} from "react";
import "./ChatList.scss";

export default function ChatList(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (props.currentUser.admin) {
        try {
          let res = await fetch(
            process.env.REACT_APP_BASE_URL + "/chat/allusers",
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                accept: "application/json",
              },
              credentials: "include",
            }
          );
          if (res.ok) {
            res = await res.json();
            setUsers(res.users.map((username) => {return ({username: username, image: Math.floor(Math.random() * 50) + 2})}));
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        setUsers([{username:"admin", image:1}]);
      }
    };
    fetchData();
  }, [props.currentMessages]);

  return (
    <div class="a1-column a1-long a1-elastic friends-panel">
      {users.map((user) => {
        return (
          <div
            class="a1-row a1-center-items-v a1-padding a1-justify-items a1-spaced-items border-b friend active chat-item"
            onClick={() => props.changeMessagesList(user.username)}
          >
            <img
              src={
                "https://xsgames.co/randomusers/assets/avatars/pixel/" +
                user.image+
                ".jpg"
              }
              class="profile-pic side-friend-profile-pic"
              alt="Profile Picture"
            />
            <div class="a1-column a1-long a1-elastic">
              <div class="a1-row a1-long a1-elastic">
                <span class="a1-long a1-elastic">{user.username}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
