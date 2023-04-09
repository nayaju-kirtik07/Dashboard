import React from "react";
import { useState } from "react";
import Validation from "./Validation";
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const AddTeams = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
  useContext(Context);
  const {accessToken} = useContext(AuthenticationContext);
  const initialData = {
    name: "",
    image: "",
    position: "",
    description: "",
  };
  const [data, setData] = useState(initialData);
  const [localData, setLocalData] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    setLocalData(accessToken);
  }, [accessToken]);

  const handleAdd = (e) =>{
    e.preventDefault();

    axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/profile/addprofile`,
        data: {
          ...data,
        },
        headers: {
          authorization: `Bearer ${localData}`,
        },
      })
        .then((res) => {
          setSuccessMessage("Team added successfully!!");
          setData(initialData);
          setErrorShow(false);
          setSuccessShow(true);
        })
        .catch((err) => {
          setErrorMessage(err?.response?.data?.message);
          setSuccessShow(false);
          setErrorShow(true);
        });
  }


  return (
    <div>
      <div className="container add-form my-5 p-3">
        <h1 className="addProductHeading">Add Team</h1>
        <form className="mt-4">
          <div className="row">
            <div className="col-6 my-3">
              <label htmlFor="exampleInputName" className="form-label">
                Name <Validation />
              </label>{" "}
              <br />
              <input
                type="text"
                className="form-control input-field"
                id="formControlName"
                name="name"
                value={data.name}
                onChange={(e) => handleChange(e)}
                placeholder="Enter Team Name"
              />
            </div>
            <div className="col-6 my-3">
              <label htmlFor="formControlCover" className="form-label">
                Image <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field"
                id="formControlCover"
                name="image"
                value={data.image}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter image URL"
              />
              <div className="inputCoverImage">
              {data?.image ? <img src={data?.image} alt="" height='100px' width='100px' /> : ""}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 my-3">
              <label htmlFor="formControlPrice" className="form-label">
                Position <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field addTeamPosition"
                id="formControlPosition"
                name="position"
                value={data.position}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Product Position"
              />
            </div>
          </div>
          <div className="my-3">
            <label htmlFor="formControlDescription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control input-field team-discription"
              id="formControlDeascription"
              name="description"
              value={data.description}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder="Enter Team Details"
            />
          </div>
        </form>
        <div className="add-button">
          <button className="product-btn" onClick={(e) => {handleAdd(e)}}>
            <i className="fa-solid fa-plus"></i> <span>Add Team </span>
          </button>

          <button
            className="btn btn-light ms-3"
            // onClick={() => {
            //   navigate("/product");
            // }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeams;
