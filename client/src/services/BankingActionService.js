export async function getActionsInRange(range) {
    let rangeNum;
    switch (range) {
      case "ALL":
        rangeNum = -1;
        break;
      case "YEAR":
        rangeNum = 365;
        break;
      case "MONTH":
        rangeNum = 30;
        break;
      case "WEEK":
        rangeNum = 7;
        break;
      default:
        toast.error("Invalid range", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    }
    setCurrentRange(range);
    let url;
    if (rangeNum === -1) {
      url = props.admin
        ? props.action + "/all" + props.action + "s"
        : props.action + "/user" + props.action + "s";
    } else {
      url = props.admin
        ? props.action + "/adminrange?range=" + rangeNum.toString()
        : props.action + "/range?range=" + rangeNum.toString();
    }

    let res = await fetch(process.env.REACT_APP_BASE_URL + "/" + url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      res = await res.json();
      const resRows = res.rows.map((x) => x.action);
      setRows(resRows);
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