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
      <Header />
      <Routes>
        <Route
          exact
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route exact path="/login" element={<LogIn />} />
        <Route exact path="/room/:roomId" element={<Room />} />
        <Route
          exact
          path="/profile/:id"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
