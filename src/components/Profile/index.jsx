import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    authorization: "Bearer " + localStorage.getItem("access_token"),
  },
};

export default function Profile(props) {
  const { currId } = props;
  const [userData, setUserData] = useState({});
  const [friendStatus, setFriendStatus] = useState({});
  const params = useParams();

  const handleAddFriend = () => {};

  useEffect(async () => {
    setUserData((await axios.get(`${API_URL}/user/${params.id}`)).data);
  }, []);

  useEffect(async () => {
    setFriendStatus(
      (
        await axios.post(
          `${API_URL}/user/friends/check`,
          { otherid: userData.userid },
          axiosConfig
        )
      ).data.result
    );
  }, [userData]);
  return (
    <>
      <div>
        <img
          crossOrigin="*"
          src="http://localhost:4000/api/images/c3a6e98c93546a983d21fcc620edb088"
          width="250px"
          height="250px"
        ></img>
        <h1>Username: {userData.username}</h1>
        <h1>Email: {userData.email}</h1>
        <h1>
          Full Name: {userData.firstname} {userData.lastname}
        </h1>
        <h1>Age: {userData.age}</h1>
        <h1>Verified: {userData.verified ? "Yes" : "No"}</h1>
        {currId.userid !== userData.userid ? (
          friendStatus ? (
            <button onClick={handleAddFriend}>Remove Friend</button>
          ) : (
            <button onClick={handleAddFriend}>Add Friend</button>
          )
        ) : null}
      </div>
    </>
  );
}
