import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState, React } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import axios from "axios";
import Profile from "./components/Profile";
import Room from "./components/Room";
import Header from "./components/Header";

const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

const checkLogin = () => {
  return !!localStorage.getItem("access_token");
};

function RequireAuth({ children }) {
  return !checkLogin() ? <Navigate to="/login" /> : children;
}

function App() {
  const [socket, setSocket] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currId, setCurrId] = useState(0);

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };

  useEffect(async () => {
    setCurrId((await axios.get(`${API_URL}/user`, axiosConfig)).data);
  }, []);
  // useEffect(() => {
  //   if (socket === null) {
  //     setSocket(io("http://localhost:4000"));
  //   }
  // }, []);

  // if (socket) {
  //   socket.on("message", (text) => {
  //     setMessages(messages.concat(text));
  //   });
  // }

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  // const handleClick = (e) => {
  //   socket.emit("message", textMessage);
  // };

  const verifyUser = (e) => {
    const userid = window.location.search.split("=")[1];
    console.log(userid);
    axios
      .get(`http://localhost:4000/api/user/account/verify/${userid}`)
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <>
      {/* <div className="App">
        Hello world
        <ul>
          {messages.map((message) => (
            <li>{message}</li>
          ))}
        </ul>
        <input
          placeholder="message"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      <button onClick={verifyUser}>Verify</button>
      </div> */}
      <Header currId={currId} />
      <Routes>
        <Route
          exact
          path="/home"
          element={
            <RequireAuth>
              <Home currId={currId} />
            </RequireAuth>
          }
        />
        <Route exact path="/login" element={<LogIn currId={currId} />} />
        <Route exact path="/room/:roomId" element={<Room currId={currId} />} />
        <Route
          exact
          path="/profile/:id"
          element={
            <RequireAuth>
              <Profile currId={currId} />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
