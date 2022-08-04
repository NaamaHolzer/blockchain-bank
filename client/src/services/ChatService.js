export async function getChatUsers() {
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
          setUsers(
            res.users.map((username) => {
              return {
                username: username,
                image: Math.floor(Math.random() * 50) + 2,
              };
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setUsers([{ username: "admin", image: 1 }]);
    }
  }