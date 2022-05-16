import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./home.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

export default function Home(props) {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [filter, setFilter] = useState("");

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

  const handleFriendClick = (id) => (e) => {
    window.location.href = "http://localhost:3000/profile/" + id;
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const newsItems = reorder(friends, source.index, destination.index);
    setFriends(newsItems);
  };

  return (
    <>
      <div>
        <button>Show All Friends</button>
        <button>Incoming Requests</button>
        <button>Outgoing Requests</button>
      </div>
      <div className={styles.center}>
        <span>Friends: </span>
        <input onChange={(e) => setFilter(e.target.value)}></input>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <ul
              className={styles.cardsBox}
              {...provided.droppableProps}
              {...provided.placeholder}
              ref={provided.innerRef}
            >
              {friends
                .filter(
                  (friend) =>
                    friend.firstname
                      .toLowerCase()
                      .includes(filter.toLowerCase()) ||
                    friend.lastname.toLowerCase().includes(filter.toLowerCase())
                )
                .map((friend, index) => {
                  return (
                    <Draggable
                      key={friend.email}
                      draggableId={friend.email}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={handleFriendClick(friend.userid)}
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
                      )}
                    </Draggable>
                  );
                })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
