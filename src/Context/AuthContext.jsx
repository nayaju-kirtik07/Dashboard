import React, { createContext, useState } from "react";
import { useEffect } from "react";

export const AuthenticationContext = createContext();

const AuthContext = (props) => {
  const [user, setUser] = useState();
  const [accessToken, setAccessToken] = useState();


  useEffect(() => {
    if (user && accessToken) {
      localStorage.setItem("detail", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(accessToken));
    }
  }, [user, accessToken]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token"))) {
      setAccessToken(JSON.parse(localStorage.getItem("token")));
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ setUser, user, setAccessToken, accessToken }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};

export default AuthContext;
