import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const Banner = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const { accessToken } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState("");
  const [slug, setSlug] = useState("");
  const [reload, setReload] = useState(false);
  const [dataToEdit, setDataToEdit] = useState({});
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState({});

  const headers = [
    {
      title: "Title",
      field: "title",
      render: (data) => (
        <>
          <span>
            <img
              className="mapped-image"
              data-bs-toggle="modal"
              data-bs-target="#imagemodal"
              src={data?.image}
              alt={data?.title}
              onClick={() => {
                setImage(data?.image);
              }}
            />
          </span>{" "}
          {data?.title}
        </>
      ),
    },
  ];

  const action = [
    {
      icon: <i className="fa-solid fa-eye eye-icon view-icon"></i>,
      title: "Detail",
      action: (e, slug) => handleViewDetail(e, slug),
      color: "#d27182",
    },
    {
      icon: (
        <i
          className="fa-solid fa-pen-to-square edit-icon"
          data-bs-toggle="modal"
          data-bs-target="#editModal"
        ></i>
      ),
      title: "Edit",
      action: (e, slug) => handleEdit(e, slug),
      color: "blue",
    },
    {
      icon: (
        <i
          className="fa-solid fa-trash delete-icon"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        ></i>
      ),
      title: "Delete",
      action: (e, slug) => setSlug(slug),
      color: "red",
    },
  ];

  const handleViewDetail = (e, slug) => {
    e.preventDefault();
    navigate(`/banner/${slug}`);
  };
  useEffect(() => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/banner/getallbanner`,
    })
      .then((res) => {
        setData(res?.data);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });

  }, [reload]);

  useEffect(() => {
    setLocalData(accessToken);
  } , [accessToken]);

  const handleDelete = (e) => {
    e.preventDefault();
    const newData = data.find((element) => element.slug !== slug);

    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/banner/deletebanner/${slug}`,
      data: {
        ...newData,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then((res) => {
        setReload(!reload);
        setSuccessMessage("Banner Deleted Successfully");
        setErrorShow(false);
        setSuccessShow(true);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDataToEdit({ ...dataToEdit, [name]: value });
  };

  const handleEdit = (e, slug) => {
    e.preventDefault();
    setSlug(slug);
    const editData = data.find((element) => element.slug === slug);
    setDataToEdit(editData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_URL}/banner/updatebanner/${slug}`,
      data: {
        title: dataToEdit?.title,
        banner_link: dataToEdit?.banner_link,
        image: dataToEdit?.image,
        description: dataToEdit?.description,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
    .then((res) => {
        setReload(!reload);
        setSuccessMessage("Banner updated successfully");
        closeModal();
        setErrorShow(false);
        setSuccessShow(true);
      })
      .catch((err) => {
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  const closeModal = () => {
    const closeButton = document.getElementById("closeModal");
    closeButton.click();
  };

  return (
    <>
      <div className="container product-table mt-5">
        <div className="product-button mb-3">
          <span>
            <p className="page-heading">Banner List</p>
          </span>
          <button
            className="product-btn"
            onClick={() => navigate("/addbanner")}
          >
            <i className="fa-solid fa-plus"></i> <span>Add Banner </span>
          </button>
        </div>

        <Table headers={headers} data={data} action={action} loader={loader} />
      </div>

      <div
        className="modal fade"
        id="imagemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content modal-image">
            <button
              type="button"
              className="btn-close close-button"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            {image ? (
              <img src={image} alt="" />
            ) : (
              <img src="./noimage.jpg" alt="" />
            )}
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete Banner
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Do you want to delete this Banner?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  handleDelete(e);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog editModule">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Banner
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="container modal-body edit-form my-3">
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
                      value={dataToEdit?.title}
                      onChange={(e) => handleChange(e)}
                      placeholder="Enter Banner Title"
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
                      value={dataToEdit?.banner_link}
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
                      value={dataToEdit?.image}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      placeholder="Enter images URL's"
                    />
                    <div className="inputCoverImage">
                      {dataToEdit?.image ? (
                        <img
                          src={dataToEdit?.image}
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
                  <label
                    htmlFor="formControlDescription"
                    className="form-label"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control input-field product-discription"
                    id="formControlDeascription"
                    name="description"
                    value={dataToEdit?.description}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="Enter Product Details"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  handleUpdate(e);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
