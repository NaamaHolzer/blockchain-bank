export async function getBalance() {
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
      setCurrentUser(res.currentUser);
      await setCurrencyConversion(res.currentUser.balance, currency);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getUserAccountDetails() {
  let res = await fetch(
    process.env.REACT_APP_BASE_URL + "/account/getUserDetails",
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
    setUserDetails(res.userDetails);
    setFirstNameVal(res.userDetails.firstName);
    setLastNameVal(res.userDetails.lastName);
    setEmailVal(res.userDetails.email);
  } else {
    res = await res.json();
    toast.error(res.message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
}
