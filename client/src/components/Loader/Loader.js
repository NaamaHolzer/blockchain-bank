import React from "react";
import loader from "../../images/loader.svg";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="spinner-container">
      <img src={loader} className="loader-img" />
      <div className="loading-spinner"></div>
      <p className="loader-text">Loading...</p>
    </div>
  );
}
