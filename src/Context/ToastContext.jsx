import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { ErrorToster, SuccessToster } from "../Component/Toster";

export const Context = createContext();

export const AllContext = (props) => {
  const [successmessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successShow , setSuccessShow] = useState(false);
  const [errorShow , setErrorShow] = useState(false);
  
  return (
    <Context.Provider
      value={{
        setSuccessMessage,
        setErrorMessage,
        setSuccessShow,
        setErrorShow
      }}
    >
      {props.children}
      <SuccessToster message={successmessage} show={successShow} setShow = {setSuccessShow} />
      <ErrorToster message={errorMessage} show={errorShow} setShow={setErrorShow} />
    </Context.Provider>
  );
};
