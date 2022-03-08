import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./room.module.css";

const API_URL = `http://localhost:4000/api`;

export default function Room(props) {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [otherData, setOtherData] = useState({});

  useEffect(() => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    console.log(window.location.pathname.split("/")[2]);
    axios
      .post(
        `${API_URL}/user/room/all`,
        {
          otherId: window.location.pathname.split("/")[2],
        },
        axiosConfig
      )
      .then(({ data }) => {
        setMessages(data.messages);
      });
    axios
      .get(`${API_URL}/user`, axiosConfig)
      .then(({ data }) => setUserData(data));
    axios
      .get(
        `${API_URL}/user/${window.location.pathname.split("/")[2]}`,
        axiosConfig
      )
      .then(({ data }) => setOtherData(data));
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <>
      <h1 className={style.centerText}>Messages:</h1>
      <div className={style.chatWindow}>
        <ul className={style.noBullets}>
          {messages
            ? messages.map((message, index) => (
                <li
                  key={index}
                  className={
                    message.userid_1 == userData.id
                      ? style.rightText
                      : style.leftText
                  }
                >
                  {message.userid_1 == userData.id
                    ? `${userData.firstname} ${userData.lastname}: ${message.message}`
                    : `${otherData.firstname} ${otherData.lastname}: ${message.message}`}
                </li>
              ))
            : null}
        </ul>
      </div>
    </>
  );
}
