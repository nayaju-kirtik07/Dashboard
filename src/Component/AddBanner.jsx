import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const AddBanner = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const {accessToken} = useContext(AuthenticationContext);

  const navigate = useNavigate();
  const initialData = {
    title: "",
    description: "",
    image: "",
    banner_link: "",
  };
  const [data, setData] = useState(initialData);
  const [localData, setLocalData] = useState("");

  useEffect(() => {
    setLocalData(accessToken);
  }, [accessToken]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/banner/createbanner`,
      data: {
        ...data,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then(() => {
        setData(initialData);
        setSuccessMessage("Banner has been added Successfully!!");
        setErrorShow(false);
        setSuccessShow(true);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  return (
    <div>
      <div>
        <div className="container add-form p-3">
          <p className="page-heading">Add Banner</p>
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
                <label htmlFor="formControlCover" className="form-label">
                  Banner Link
                </label>
                <input
                  type="text"
                  className="form-control input-field"
                  id="formControlCover"
                  name="banner_link"
                  value={data?.banner_link}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  placeholder="Enter Banner Link"
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="formControlImage" className="form-label">
                Image <Validation />
              </label>
              <div className=" input-image">
                <input
                  type="text"
                  className="form-control input-field"
                  id="formControlImage"
                  name="image"
                  value={data.image}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  placeholder="Enter images URL's"
                />
                <div className="inputCoverImage">
                  {data?.image ? (
                    <img
                      src={data?.image}
                      alt=""
                      height="100px"
                      width="100px"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="formControlDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control input-field product-discription"
                id="formControlDeascription"
                name="description"
                value={data.description}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Banner Info"
              />
            </div>
          </form>
          <div className="add-button">
            <button
              className="product-btn"
              onClick={(e) => {
                handleAdd(e);
              }}
            >
              <i className="fa-solid fa-plus"></i> <span>Add Banner </span>
            </button>

            <button
              className="btn btn-light ms-3"
              onClick={() => {
                navigate("/banner");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
