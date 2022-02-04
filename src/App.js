import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useState, React } from "react";

function App() {
  // const socket = io("http://localhost:4000");
  const [socket, setSocket] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket === null) {
      setSocket(io("http://localhost:4000"));
    }
    if (socket) {
      socket.on("message", (text) => {
        setMessages(messages.concat(text));
      });
    }
  });

  const handleClick = (e) => {
    socket.emit("message", textMessage);
  };

  return (
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
  );
}

export default App;
