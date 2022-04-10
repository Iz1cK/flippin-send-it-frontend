import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./header.module.css";
import logo from "../../assets/Images/flippinsenditmain.PNG";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + localStorage.getItem("access_token"),
  },
};

export default function Header() {
  const [currId, setCurrId] = useState(-1);
  const navigate = useNavigate();
  useEffect(async () => {
    setCurrId((await axios.get(`${API_URL}/user`, axiosConfig)).data.userid);
  }, []);

  const handleLogout = (e) => {
    window.localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.blurMe}></div>
      <div className={styles.leftSide}>
        <img src={logo} className={styles.logoImg} />
        <div>
          <Link to="/home">Home</Link>
        </div>

        <div>
          <Link to="/add-friend">Add Friends</Link>
        </div>

        <div>
          <Link to="/room/1">Chats</Link>
        </div>

        <div>
          <Link to={`/profile/${currId}`}>Profile</Link>
        </div>

        <div className={styles.girthyDiv}>
          <label>Search:</label>
          <input type="text" className={styles.inputStyle}></input>
        </div>
      </div>
      <div className={styles.rightSide}>
        <div>
          <Link to="/about">About us</Link>
        </div>

        <div onClick={handleLogout}>Log Out</div>
      </div>
    </header>
  );
}
