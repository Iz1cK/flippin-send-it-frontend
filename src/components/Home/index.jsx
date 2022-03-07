import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

let API_URL = `http://localhost:4000/api`;

export default function Home(props) {
  const [friends, setFriends] = useState([]);
  const goTo = useNavigate();

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

  useEffect(() => {
    console.log(friends);
  }, [friends]);

  const handleFriendClick = (e) => {
    console.log(e.target.value);
    window.location.href = "http://localhost:3000/profile/" + e.target.value;
  };
  return (
    <>
      <div>Friends:</div>
      <ul>
        {friends
          ? friends.map((friend, index) => (
              <li onClick={handleFriendClick} key={index} value={friend.id}>
                {friend.firstname} {friend.lastname}
              </li>
            ))
          : null}
      </ul>
    </>
  );
}
