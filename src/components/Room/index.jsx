import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import style from "./room.module.css";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
import { io } from "socket.io-client";
import { useParams } from "react-router";
// import UseStyles from "../useStyles";

const API_URL = `http://localhost:4000/api`;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + localStorage.getItem("access_token"),
  },
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function Room(props) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [currId, setCurrId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();
  const bottomOfChat = useRef();

  // const classes = UseStyles();

  useEffect(async () => {
    setLoading(true);
    if (socket === null) {
      setSocket(io("http://localhost:4000"));
    }
    async function updateData() {
      const allParticipants = (
        await axios.post(
          `${API_URL}/room/all-participants`,
          { roomId },
          axiosConfig
        )
      ).data;
      setParticipants(allParticipants.result);
      setCurrId(allParticipants.userId);
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
    await updateData();
  }, []);

  useEffect(() => {
    if (messages.length != 0 && participants.length != 0) {
      setTimeout(() => {
        bottomOfChat.current.scrollIntoView();
      }, 0);
      setLoading(false);
      if (participants.length > 2) {
        axios
          .post(`${API_URL}/room`, { roomId: roomId }, axiosConfig)
          .then(({ data }) => {
            setRoomName(data.result.name);
          });
      } else {
        const filteredParticipants = participants.filter(
          (participant) => participant.userid !== currId
        );
        setRoomName(
          `${filteredParticipants[0].firstname} ${filteredParticipants[0].lastname}`
        );
      }
    }
  }, [messages, participants]);
  const sendMessageHandler = (e) => {
    const newMessage = {
      message: message,
      roomId: +roomId,
      userid: currId,
    };
    axios
      .post(`http://localhost:4000/api/room/send`, newMessage, axiosConfig)
      .then(({ data }) => {
        if (data.status) setMessages(messages.concat(newMessage));
      });
  };

  if (loading) return <>Loading...</>;
  return (
    <div style={{ overflowY: "hidden", marginTop: "10px" }}>
      <div className={style.flexBox}>
        <div className={style.roomName}>{`${roomName}`}</div>
        <div className={`${style.chatWindow}`}>
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
                      <Box className={`${style.messageBox}`}>
                        <div className={style.imageAndName}>
                          <Avatar
                            sx={{
                              bgcolor: stringToColor(
                                `${participants[i].firstname[0]} ${participants[i].lastname[0]}`
                              ),
                            }}
                          >
                            {participants[i].firstname[0]}
                            {participants[i].lastname[0]}
                          </Avatar>
                          <span className={style.msgFrom}>
                            {participants[i].firstname}{" "}
                            {participants[i].lastname}:
                          </span>
                        </div>
                        <span className={style.msgMessage}>
                          {message.message}
                        </span>
                      </Box>
                    </li>
                  );
              }
            })}
            <li ref={bottomOfChat}></li>
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
    </div>
  );
}
