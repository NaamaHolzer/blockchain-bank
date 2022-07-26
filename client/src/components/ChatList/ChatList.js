import React from "react";
import "./ChatList.scss";

export default function ChatList() {
  const users = [
    { username: "naama", image: Math.floor(Math.random() * 50) + 1 },
    { username: "kayla", image: Math.floor(Math.random() * 50) + 1 },
    { username: "shira", image: Math.floor(Math.random() * 50) + 1 },
    { username: "tamar", image: Math.floor(Math.random() * 50) + 1 },
  ];
  return (
    <div class="a1-column a1-long a1-elastic friends-panel">
      {users.map((user) => {
        return (
          <div
            class="a1-row a1-center-items-v a1-padding a1-justify-items a1-spaced-items border-b friend active chat-item"
            onclick="goTo()"
          >
            <img
              src={
                "https://xsgames.co/randomusers/assets/avatars/pixel/" +
                user.image +
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
