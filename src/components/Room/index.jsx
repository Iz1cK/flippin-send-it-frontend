import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./room.module.css";

const API_URL = `http://localhost:4000/api`;

export default function Room(props) {
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [otherData, setOtherData] = useState({});

  useEffect(async () => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setMessages(
      (
        await axios.post(
          `${API_URL}/user/room/allMessages`,
          {
            otherId: window.location.pathname.split("/")[2],
          },
          axiosConfig
        )
      ).data.messages
    );
    setUserData((await axios.get(`${API_URL}/user`, axiosConfig)).data);
    setOtherData(
      (
        await axios.get(
          `${API_URL}/user/${window.location.pathname.split("/")[2]}`,
          axiosConfig
        )
      ).data
    );
  }, []);

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
                    message.userid == userData.userid
                      ? style.rightText
                      : style.leftText
                  }
                >
                  {message.userid == userData.userid ? (
                    <div className={style.messageBox}>
                      <span className={style.msgFrom}>
                        {userData.firstname} {userData.lastname}:
                      </span>
                      <span className={style.msgMessage}>
                        {message.message}
                      </span>
                    </div>
                  ) : (
                    <div className={style.messageBox}>
                      <span className={style.msgFrom}>
                        {otherData.firstname} {otherData.lastname}:
                      </span>
                      <span className={style.msgMessage}>
                        {message.message}
                      </span>
                    </div>
                  )}
                </li>
              ))
            : null}
        </ul>
      </div>
    </>
  );
}
