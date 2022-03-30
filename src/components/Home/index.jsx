import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./home.module.css";

let API_URL = `http://localhost:4000/api`;

export default function Home(props) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${API_URL}/user/friends/all`, axiosConfig).then(({ data }) => {
      setFriends(data);
    });
  }, []);

  const handleFriendClick = (e) => {
    window.location.href = "http://localhost:3000/profile/" + e.target.value;
  };

  return (
    <>
      <div>Friends:</div>
      <div className={styles.cardsBox}>
        {friends
          ? friends.map((friend, index) => (
              <div
                onClick={handleFriendClick}
                key={index}
                value={friend.userid_2}
                className={styles.card}
              >
                <img
                  width={"250px"}
                  height={"250px"}
                  src={`https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg`}
                ></img>
                <div className={styles.infoBox}>
                  <h2>
                    {friend.firstname} {friend.lastname}
                  </h2>
                  <p>
                    Age: {friend.age}
                    <br></br>
                    E-mail:{friend.email}
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
