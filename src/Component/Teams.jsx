import React, { useEffect } from "react";
import axios from "axios";
import Table from "./Table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const Teams = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const {accessToken} = useContext(AuthenticationContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");
  const [dataToDelete, setDataToDelete] = useState({});
  const [localData, setLocalData] = useState("");
  const [reload, setReload] = useState(false);
  const [dataToEdit, setDataToEdit] = useState({});
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState({});

  const header = [
    {
      title: "Name",
      field: "name",
      render: (data) => (
        <div>
          <span>
            <img
              className="mapped-image"
              data-bs-toggle="modal"
              data-bs-target="#imagemodal"
              src={data?.image}
              alt={data?.name}
              onClick={() => {
                setImage(data?.image);
              }}
            />
          </span>
          {data?.name}
        </div>
      ),
    },
    {
      title: "Position",
      field: "position",
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
      action: (e, slug) => handleSlug(e, slug),
      color: "red",
    },
  ];

  useEffect(() => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/profile/getallprofile`,
    })
      .then((res) => {
        setData(res?.data?.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });

    }, [reload]);
    
    useEffect(() => {
      setLocalData(accessToken);      
  } , [accessToken])

  const handleSlug = (e, slug) => {
    e.preventDefault();
    setSlug(slug);
    setDataToDelete(data.find((element) => element.slug === slug));
  };

  const handleDelete = (e) => {
    e.preventDefault();

    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/profile/deleteprofile/${slug}`,
      data: {
        ...dataToDelete,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then((res) => {
        setReload(!reload);
        setSuccessMessage(res?.data?.message);
        setErrorShow(false);
        setSuccessShow(true);
      })
      .catch((err) => {
        setErrorMessage("You'r Team cannot update");
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  const handleEdit = (e, slug) => {
    e.preventDefault();
    setSlug(slug);
    setDataToEdit(data.find((element) => element.slug === slug));
  };

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setDataToEdit({ ...dataToEdit, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_URL}/profile/updateprofile/${slug}`,
      data: {
        name: dataToEdit?.name,
        image: dataToEdit?.image,
        position: dataToEdit?.position,
        description: dataToEdit?.description,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then((res) => {
        setReload(!reload);
        setSuccessMessage(res?.data?.message);
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

  const handleViewDetail = (e, slug) => {
    e.preventDefault();
    navigate(`/team/${slug}`);
  };

  const closeModal = () => {
    const closeButton = document.getElementById("closeModal");
    closeButton.click();
  };

  return (
    <div>
      <div className="container product-table mt-5">
        <div className="product-button mb-3">
          <p className="page-heading">Team List</p>
          <button
            className="product-btn"
            onClick={() => {
              navigate("/addteam");
            }}
          >
            <i className="fa-solid fa-plus"></i> <span>Add Team </span>
          </button>
        </div>
        <Table headers={header} data={data} action={action} loader={loader} />
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
                Remove Team
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Do you want to remove this Team?</div>
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
                Edit Team
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
              <form>
                <div className="row">
                  <div className="col-6 my-3">
                    <label htmlFor="formControlName" className="form-label">
                      Name <Validation />
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlName"
                      name="name"
                      value={dataToEdit.name}
                      onChange={(e) => handleChange(e)}
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
                      value={dataToEdit.image}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
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
                <div className="row">
                  <div className=" col-6 my-3">
                    <label htmlFor="formControlPosition" className="form-label">
                      Position <Validation />
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlPosition"
                      name="position"
                      value={dataToEdit.position}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
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
                    className="form-control input-field"
                    id="formControlDeascription"
                    name="description"
                    value={dataToEdit.description}
                    onChange={(e) => {
                      handleChange(e);
                    }}
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
    </div>
  );
};

export default Teams;
