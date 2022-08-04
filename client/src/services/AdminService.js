export async function getSignUpRequests() {
    let res = await fetch(
      process.env.REACT_APP_BASE_URL + "/account/getRequests",
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
      setRequests(res.users);
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

export async function validateChains() {
    try {
      let response = await fetch(
        process.env.REACT_APP_BASE_URL + "/blockchain",
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        response = await response.json();
        if (response.loansValid && response.transactionsValid) {
          toast.success("Both chains are valid!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (!response.loansValid && !response.transactionsValid) {
          toast.error("Both chains are not valid!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (!response.loansValid) {
          toast.error("Loans chain is not valid!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Transactions chain is not valid!", {
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
    } catch (err) {
      console.log(err);
    }
  }