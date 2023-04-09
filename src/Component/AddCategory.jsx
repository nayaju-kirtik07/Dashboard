import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const AddCategory = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const {accessToken} = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const initialData = {
    title: "",
    image: "",
  };
  const [data, setData] = useState(initialData);
  const [localData, setLocalData] = useState("");

  useEffect(() => {
    setLocalData(accessToken);
  }, [accessToken]);

  const handleAdd = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/category/addcategory`,
      data: {
        ...data,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then(() => {
        setData(initialData);
        setSuccessMessage("Category Added Successfully !!");
        setErrorShow(false);
        setSuccessShow(true);
      })
      .catch((err) => {
        // console.log(err);
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };
  // console.log("success message :",successmessage)

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <div>
      <div className="container add-form my-5 p-3">
        <h1 className="addProductHeading">Add Category</h1>
        <form className="mt-4">
          <div className="row">
            <div className="col-6 my-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Title <Validation />
              </label>{" "}
              <br />
              <input
                type="text"
                className="form-control input-field"
                id="formControlTitle"
                name="title"
                value={data.title}
                onChange={(e) => handleChange(e)}
                placeholder="Enter Product Title"
              />
            </div>
            <div className="col-6 my-3">
              <label htmlFor="formControlImage" className="form-label">
                Image <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field"
                id="formControlImage"
                name="image"
                value={data.image}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter image URL"
              />
              <div className="inputCoverImage">
                {data.image ? (
                  <img src={data.image} alt="" height="100px" width="100px" />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </form>
        <div className="add-button">
          <button
            className="product-btn"
            onClick={(e) => {
              handleAdd(e);
            }}
          >
            <i className="fa-solid fa-plus"></i> <span>Add Category </span>
          </button>

          <button
            className="btn btn-light ms-3"
            onClick={() => {
              navigate("/category");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
