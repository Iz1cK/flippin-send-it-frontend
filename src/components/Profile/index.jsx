import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile(props) {
  const [userData, setUserData] = useState({});

  useEffect(async () => {
    setUserData(
      (
        await axios.get(
          `http://localhost:4000/api/user/${
            window.location.pathname.split("/")[2]
          }`
        )
      ).data
    );
  }, []);

  return (
    <>
      <div>
        <h1>Username: {userData.username}</h1>
        <h1>Email: {userData.email}</h1>
        <h1>
          Full Name: {userData.firstname} {userData.lastname}
        </h1>
        <h1>Age: {userData.age}</h1>
        <h1>Verified: {userData.verified ? "Yes" : "No"}</h1>
      </div>
    </>
  );
}
