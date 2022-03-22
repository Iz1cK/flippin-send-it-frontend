import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./room.module.css";
import { io } from "socket.io-client";
import { useParams } from "react-router";

const API_URL = `http://localhost:4000/api`;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + localStorage.getItem("access_token"),
  },
};

export default function Room(props) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState({});
  const [message, setMessage] = useState("");
  const { roomId } = useParams();
  const [currId, setCurrId] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (socket === null) {
      setSocket(io("http://localhost:4000"));
    }
    async function updateData() {
      axios
        .post(`${API_URL}/room/all-participants`, { roomId }, axiosConfig)
        .then((response) => {
          setParticipants(response.data.result);
          setCurrId(response.data.userId);
        });
      setMessages(
        (
          await axios.post(
            `${API_URL}/room/all-messages`,
            {
              roomId: roomId,
            },
            axiosConfig
          )
        ).data.messages
      );
    }
    updateData();
  }, []);

  useEffect(() => {
    if (messages.length != 0 && participants.length != 0) setLoading(false);
    console.log(messages);
    console.log(participants);
  }, [messages, participants]);

  const sendMessageHandler = (e) => {
    console.log(message);
    const newMessage = {
      message: message,
      roomId: +roomId,
      userid: currId,
    };
    axios
      .post(`http://localhost:4000/api/room/send`, newMessage, axiosConfig)
      .then((response) => {
        console.log(response);
      });
    setMessages(messages.concat(newMessage));
    window.scrollBy(0, 100);
    console.log(newMessage);
    console.log(messages);
  };

  if (loading) return <>Loading...</>;
  return (
    <>
      <h1 className={style.centerText}>Messages:</h1>
      <div className={style.flexBox}>
        <div className={style.chatWindow}>
          <ul className={style.noBullets}>
            {messages.map((message, index) => {
              for (let i = 0; i < participants.length; i++) {
                if (message.userid == participants[i].userid)
                  return (
                    <li
                      key={index}
                      className={
                        message.userid === currId
                          ? style.rightText
                          : style.leftText
                      }
                    >
                      <div className={style.messageBox}>
                        <span className={style.msgFrom}>
                          {participants[i].firstname} {participants[i].lastname}
                          :
                        </span>
                        <span className={style.msgMessage}>
                          {message.message}
                        </span>
                      </div>
                    </li>
                  );
              }
            })}
          </ul>
        </div>
        <div className={style.chatBox}>
          <input
            type="text"
            className={style.chatInput}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={sendMessageHandler} className={style.sendButton}>
            Send
          </button>
        </div>
      </div>
    </>
  );
}
