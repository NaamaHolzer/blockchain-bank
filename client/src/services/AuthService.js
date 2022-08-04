export async function getCurrentUser() {
    if (!CurrentUser || Object.keys(CurrentUser).length === 0) {
      try {
        let res = await fetch(
          process.env.REACT_APP_BASE_URL + "/auth/currentUser",
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
          setIsLoggedIn(true);
          setCurrentUser(res.currentUser);
          localStorage.setItem("currentUser", res.currentUser);
          setCounter(counter + 1);
          if (res.currentUser.admin) {
            const requestChannel = pusher.subscribe("signup-request");
            requestChannel.bind("new-request", function (data) {
              toast.info(data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });

            const balanceChannel = pusher.subscribe("balance-error");
            balanceChannel.bind("balance-error", function (data) {
              toast.info(data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
          }

          const loanAlertChannel = pusher.subscribe(
            "loan-alert" + res.currentUser.username
          );
          loanAlertChannel.bind("loan-alert", function (data) {
            toast.info(data.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  }