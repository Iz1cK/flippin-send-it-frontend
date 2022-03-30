import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./header.module.css";
import logo from "../../assets/Images/flippinsenditmain.PNG";
import { Link } from "react-router-dom";

const API_URL = `http://localhost:4000/api`;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + localStorage.getItem("access_token"),
  },
};

export default function Header() {
  const [currId, setCurrId] = useState(-1);

  useEffect(async () => {
    setCurrId((await axios.get(`${API_URL}/user`, axiosConfig)).data.userid);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.blurMe}></div>
      <div className={styles.leftSide}>
        <img src={logo} className={styles.logoImg} />
        <div>
          <Link to="/home">Home</Link>
        </div>

        <div>
          <Link to="/home">Friends</Link>
        </div>

        <div>
          <Link to="/room/1">Chats</Link>
        </div>

        <div>
          <Link to={`/profile/${currId}`}>Profile</Link>
        </div>
      </div>
      <div className={styles.rightSide}>
        <div>
          <Link to="/about">About us</Link>
        </div>

        <div>Log Out</div>
      </div>
    </header>
  );
}
