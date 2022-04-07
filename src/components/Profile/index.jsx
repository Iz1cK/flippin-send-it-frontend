import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

export default function Profile(props) {
  const [userData, setUserData] = useState({});
  const [currId, setCurrId] = useState({});

  useEffect(async () => {
    setUserData(
      (
        await axios.get(
          `${API_URL}/user/${window.location.pathname.split("/")[2]}`
        )
      ).data
    );
    setCurrId((await axios.get(`${API_URL}/user`)).data);
  }, []);
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
          <button onClick={handleAddFriend}></button>
        ) : null}
      </div>
    </>
  );
}
