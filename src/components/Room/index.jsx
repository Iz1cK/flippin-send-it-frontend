import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home(props) {
  const [friends, setFriends] = useState([]);

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
  return (
    <>
      <div>Friends:</div>
    </>
  );
}
