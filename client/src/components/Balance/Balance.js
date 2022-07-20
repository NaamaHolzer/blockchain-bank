import "./Balance.css";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function Balance(props) {
  const [balance, setBalance] = React.useState(props.currentUser.balance);

  const setCurrency = async (currency) => {
    if (currency === "LEV") setBalance(props.currentUser.balance);
    else {
      const val = (await convertCurrency()).result;
      console.log(val);
      setBalance(val);
    }
  };

  const convertCurrency = async () => {
    const usdBalance = props.currentUser.rate * props.currentUser.balance;
    console.log(props.currentUser.rate);
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
        console.log(res);
        return res;
      })
      .catch((error) => console.log("error", error));
  };

  return !props.currentUser.admin ? (
    <div className="balance">
    <p className="title">BALANCE:</p>
      <p className="amount">{balance}</p>
      <Select className="select"
        label="Balance"
        defaultValue="LEV"
        onChange={async (e) => {
          await setCurrency(e.target.value);
        }}
      >
         <MenuItem value="LEV">LEV</MenuItem>
        <MenuItem value="ILS">ILS</MenuItem>
      </Select>
    </div>
  ) : (
    <p></p>
  );
}