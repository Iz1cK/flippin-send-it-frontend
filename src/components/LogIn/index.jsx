import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import axios from "axios";
import "react-dropdown/style.css";
import Authenticator from "../../utils/Authenticator";

const API_URL =
  process.env.REACT_APP_PRODUCTION == "true"
    ? "http://localhost:4000/api"
    : process.env.REACT_APP_API_URL;

//Configurations
const TYPING_ANIMATION_SPEED = 25;
const ERROR_TIMEOUT = 3000;

//Error Messages
const accountErrors = {
  USERNAME_MISSING: "Please enter a username",
  PASSWORD_MISSING: "Please enter a password",
  PASSWORD_CONFIRMATION_MISSING: "Please enter password confirmation",
  WRONG_CONFIRMATION_PASSWORD_ERROR: "Password confirmation does not match",

  ACCOUNT_NOT_FOUND_ERROR: "Account details are incorrect",

  USERNAME_NOT_FOUND_ERROR: "Username not found",
  USERNAME_TAKEN_ERROR: "Username already taken",
  WRONG_PASSWORD_ERROR: "Password is incorrect",
  ACCOUNT_CREATED: "Account created successfully",
  DEFAULT: "An error has occured, please try again",
};

// Authentication Component
export default function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [picture, setPicture] = useState(null);
  const [registerActive, setRegisterActive] = useState(false);
  const [error, setError] = useState("");
  const [typedError, setTypedError] = useState("");

  //  Writes the error message char by char, till it matches the error value.
  useEffect(() => {
    if (!typedError) return;
    if (!error) setTypedError("");
    if (typedError && error && typedError.length < error.length)
      setTimeout(
        setTypedError,
        TYPING_ANIMATION_SPEED,
        typedError + error.charAt(typedError.length)
      );
  }, [typedError]);

  // Changes the error message, which triggers the error message writer useEffect.
  useEffect(() => {
    if (!error) return;
    let tempError = error;
    setTypedError(tempError.charAt(0));
    let errorGC = setTimeout(() => {
      if (tempError === error) setError("");
      setTypedError("");
    }, ERROR_TIMEOUT + TYPING_ANIMATION_SPEED * error.length);
    return () => {
      clearTimeout(errorGC);
    };
  }, [error]);

  useEffect(() => {
    if (Authenticator.isAccountLogin()) {
      navigate("/home");
    }
  }, []);

  const navigate = useNavigate();

  function loginAccount(e) {
    if (e && e.type !== "click" && e.key !== "Enter") return;
    if (registerActive) return setRegisterActive(false);
    if (!username) return setError(accountErrors.USERNAME_MISSING);
    if (!password) return setError(accountErrors.PASSWORD_MISSING);
    Authenticator.login({ username: username, password: password })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (!data.status) {
          window.localStorage.setItem("access_token", data.access_token);
          navigate("/home");
        } else {
          setPassword("");
          setError(accountErrors.ACCOUNT_NOT_FOUND_ERROR);
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }

  async function registerAccount(e) {
    if (e && e.type !== "click" && e.key !== "Enter") return;
    if (!registerActive) return setRegisterActive(true);
    if (!username) return setError(accountErrors.USERNAME_MISSING);
    if (!password) return setError(accountErrors.PASSWORD_MISSING);
    if (!confirm) return setError(accountErrors.PASSWORD_CONFIRMATION_MISSING);
    if (confirm !== password) {
      setConfirm("");
      return setError(accountErrors.WRONG_CONFIRMATION_PASSWORD_ERROR);
    }
    let form_data = new FormData();
    form_data.append("image", picture);

    axios
      .post(`${API_URL}/images`, form_data, {
        headers: { "Content-Type": `multipart/form-data` },
      })
      .then(({ data }) => {
        const user = {
          username: username,
          password: password,
          firstname: firstname,
          lastname: lastname,
          email: email,
          gender: gender,
          age: birthDate,
          image: data.key,
        };
        Authenticator.register(user).then((response) => {
          setError(accountErrors.ACCOUNT_CREATED);
          setRegisterActive(false);
        });
      });
  }

  // Chooses whether register account should activate or login account on enter key press.
  const keyPressChooser = (isRegisterActive) =>
    isRegisterActive ? registerAccount : loginAccount;

  return (
    <>
      <img
        src="./images/2892303.jpg"
        className={styles.backgroundImage}
        alt=""
      />
      <img src="./images/logo.png" className={styles.imageLogo} alt="" />
      <div className={styles.loginContainer}>
        {registerActive ? (
          <>
            <div className={styles.loginInnerWrapper}>
              <input
                type="text"
                name="userName"
                placeholder="Username"
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={
                  !registerActive
                    ? `${styles.input} ${styles.passwordConfirm}`
                    : styles.input
                }
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                className={
                  !registerActive
                    ? `${styles.input} ${styles.passwordConfirm}`
                    : styles.input
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
            </div>
            <div className={styles.loginInnerWrapper}>
              <input
                type="text"
                name="firstname"
                placeholder="First name"
                className={
                  !registerActive
                    ? `${styles.input} ${styles.passwordConfirm}`
                    : styles.input
                }
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last name"
                className={
                  !registerActive
                    ? `${styles.input} ${styles.passwordConfirm}`
                    : styles.input
                }
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              />
              <input
                type="date"
                onChange={(e) => setBirthDate(e.target.value)}
              ></input>
              <select
                id="cars"
                name="cars"
                className={styles.inputStyle}
                onChange={(e) => setGender(e.target.value)}
                onFocus={(e) => (e.target.value = "")}
                onKeyPress={keyPressChooser(registerActive)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {/* <input
                accept="image/*"
                type="file"
                singleupload
                onChange={(e) => {
                  setPicture(e.target.files[0]);
                }}
              ></input> */}
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => (e.target.value = "")}
              onKeyPress={keyPressChooser(registerActive)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.value = "")}
              onKeyPress={keyPressChooser(registerActive)}
            />
          </>
        )}
      </div>
      <div className={styles.responseBox}>
        <p>{typedError}</p>
        {registerActive ? (
          <>
            <div
              name="register"
              className={styles.button}
              onClick={registerAccount}
            >
              Register
            </div>
            <div name="login" onClick={loginAccount} className={styles.button}>
              Log in
            </div>
          </>
        ) : (
          <>
            <div name="login" onClick={loginAccount} className={styles.button}>
              Log in
            </div>
            <div
              name="register"
              className={styles.button}
              onClick={registerAccount}
            >
              Register
            </div>
          </>
        )}
      </div>
    </>
  );
}
