import axios from "axios";

const isAccountLogin = () => !!localStorage.getItem("access_token");
const login = (account) =>
  axios.post("http://localhost:4000/api/user/login", account);
const register = (account) =>
  axios.post("http://localhost:4000/api/user/register", account);

export default {
  isAccountLogin,
  login,
  register,
};
