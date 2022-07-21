import "./Balance.css";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@mui/material/Button";
import { useEffect } from "react";
export default function Balance(props) {
  const [balance, setBalance] = React.useState(props.currentUser.balance);
  const [currency,setCurrency] = React.useState('LEV');
  const[currentUser,setCurrentUser] = React.useState(props.currentUser)

  const verify = async () => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
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
          await setCurrencyConversion(res.currentUser.balance,currency)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [balance]);

  const setCurrencyConversion = async (amount,currentCurrency) => {
    setCurrency(currentCurrency)
    if (currentCurrency === "LEV")
     {
      setBalance(amount);
    }
    else {
      const val = (await convertCurrency(amount)).result;
      setBalance(val);
    }
  };

  const convertCurrency = async (amount) => {
    const usdBalance = props.currentUser.rate * amount;
    return await fetch(
      "https://api.apilayer.com/currency_data/convert?to=" +
        "ILS" +
        "&from=" +
        "USD" +
        "&amount=" +
        usdBalance.toString(),
      {
        method: "GET",
        redirect: "follow",
        headers: { apikey: "Ijkym7cZLQyCC9JIy6Ac4tKbEoqCAgud" },
      }
    )
      .then((response) => {
        const res = response.json();
        return res;
      })
      .catch((error) => console.log("error", error));
  };

  return !props.currentUser.admin ? (
    <div className="balance">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <p className="title">BALANCE:</p>
      <p className="amount">{Math.round((balance + Number.EPSILON) * 100) / 100}</p>
      <Select
        className="select"
        label="Balance"
        defaultValue="LEV"
        onChange={async (e) => {
          await setCurrencyConversion(currentUser.balance,e.target.value);
        }}
      >
        <MenuItem value="LEV">LEV</MenuItem>
        <MenuItem value="ILS">ILS</MenuItem>
      </Select>
    </div>
  ) : (
    <Button variant="outlined" onClick={verify}>
      VERIFY CHAINS
    </Button>
  );
}
