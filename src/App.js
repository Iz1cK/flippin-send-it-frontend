import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState, React } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import LogIn from "./components/LogIn";

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
  var string = "";

  useEffect(() => {
    if (socket === null) {
      setSocket(io("http://localhost:4000"));
    }
  }, []);

  if (socket) {
    socket.on("message", (text) => {
      string += text;
      console.log(string);

      setMessages(messages.concat(text));
    });
  }

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  const handleClick = (e) => {
    socket.emit("message", textMessage);
  };

  return (
    <>
      <div className="App">
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
      </div>
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
      </Routes>
    </>
  );
}

export default App;
