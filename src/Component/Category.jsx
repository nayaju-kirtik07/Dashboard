import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const Category = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const { accessToken } = useContext(AuthenticationContext);
  const [data, setData] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState({});
  const [localData, setLocalData] = useState("");
  const [reload, setReload] = useState(false);
  const [slug, setSlug] = useState("");
  const navigate = useNavigate();
  const [dataToEdit, setDataToEdit] = useState({});
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState({});

  const header = [
    {
      title: "Categories",
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
          {data?.title}{" "}
        </>
      ),
    },
    {
      title: "No of Products",
      field: "products",
      render: (data) => data?.products?.length,
    },
  ];

  const action = [
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
    {
      icon: <i className="fa-solid fa-box-open eye-icon"></i>,
      title: "View",
      action: (e, slug) => handleViewDetail(e, slug),
      color: "#d27182",
    },
  ];

  // console.log("data are :", data);

  useEffect(() => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/category/getallcategorywithproducts`,
    })
      .then((res) => {
        setData(res.data.data);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        // console.log(err);
      });

  }, [reload]);

  useEffect(() => {
    setLocalData(accessToken);
  } , [accessToken]);

  const handleDelete = (e) => {
    e.preventDefault();
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/category/${slug}`,
      data: {
        ...categoryToDelete,
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
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  const handleSlug = (e, slug) => {
    e.preventDefault();
    setSlug(slug);
    setCategoryToDelete(data.find((element) => element.slug === slug));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    navigate("/addcategory");
  };

  const handleEdit = (e, slug) => {
    e.preventDefault();
    setSlug(slug);
    setDataToEdit(data.find((element) => element.slug === slug));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_URL}/category/${slug}`,
      data: {
        title: dataToEdit?.title,
        image: dataToEdit?.image,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then((res) => {
        setReload(!reload);
        setSuccessMessage("your category is updated");
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDataToEdit({ ...dataToEdit, [name]: value });
  };

  const closeModal = () => {
    const closeButton = document.getElementById("closeModal");
    closeButton.click();
  };

  const handleViewDetail = (e, slug) => {
    e.preventDefault();
    navigate(`/category/${slug}`);
  };

  return (
    <div>
      <div className="container product-table mt-5">
        <div className="product-button mb-3">
          <p className="page-heading">Category List</p>
          <button className="product-btn" onClick={(e) => handleAdd(e)}>
            <i className="fa-solid fa-plus"></i> <span>Add Category </span>
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
                Delete Category
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Category?
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
                Edit Category
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
                    <label htmlFor="formControlTitle" className="form-label">
                      Title <Validation />
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlTitle"
                      name="title"
                      value={dataToEdit.title}
                      onChange={(e) => handleChange(e)}
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
                      value={dataToEdit.image}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {dataToEdit.image ? (
                      <img
                        src={dataToEdit.image}
                        alt=""
                        height="100px"
                        width="100px"
                      />
                    ) : (
                      ""
                    )}
                  </div>
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

export default Category;
