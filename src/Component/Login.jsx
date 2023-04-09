import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
  useContext(Context);
  const { setUser , setAccessToken } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const initialData = {
    email: "main@gmail.com",
    password: "p@ssW0rd",
  };

  const [logInData, setLogInData] = useState(initialData);

  const handleChange = (e) => {
    e.preventDefault();
    setLogInData({ ...logInData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if(JSON.parse(localStorage.getItem("detail"))) {
      navigate("/home");
    }
  } , [])

  const handleSubmit = (e) => {
    e.preventDefault();
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/user/login`,
        data: {
          ...logInData,
        },
      })
        .then((res) => {
          setSuccessMessage("Login Successfully")
          setUser(res?.data?.emailexist);
          setAccessToken(res?.data?.accessToken);
          navigate("/home");
          setErrorShow(false);
          setSuccessShow(true);
        })
        .catch((err) => {
          setErrorMessage(err?.response?.data?.message);
          setSuccessShow(false);
          setErrorShow(true);
        });
  };

  return (
    <div className="LogIn">
      <div className="container login mt-5">
        <div className="card mx-auto">
          <div className="container">
            <h1 className="log-In">Login</h1>
            <form>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  name="email"
                  value={logInData.email}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={logInData.password}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <button
                type="button"
                className="button mb-4"
                onClick={(e) => handleSubmit(e)}
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
