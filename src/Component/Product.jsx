import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductEditModal from "./ProductEditModal";
import Table from "./Table";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const Product = (props) => {
  const { setSuccessMessage, setErrorMessage, setErrorShow, setSuccessShow } =
    useContext(Context);
    const {accessToken} = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [slug, setSlug] = useState("");
  const [dataToDelete, setDataToDelete] = useState({});
  const [localData, setLocalData] = useState("");
  const [dataToEdit, setDataToEdit] = useState({});
  const [reload, setReload] = useState(false);
  const [response, setResponse] = useState([]);
  const [imageToEdit, setImageToEdit] = useState([]);
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState({});

  useEffect(() => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/product/getallproduct`,
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

  const header = [
    {
      title: "Product",
      field: "title",
      render: (data) => (
        <div>
          <span>
            <img
              className="mapped-image"
              data-bs-toggle="modal"
              data-bs-target="#imagemodal"
              src={data?.cover_image}
              alt={data?.title}
              onClick={() => {
                setImage(data?.cover_image);
              }}
            />
          </span>
          {data?.title}
        </div>
      ),
    },
    {
      title: "Category",
      field: "category",
      render: (data) => data?.category?.title,
    },
    {
      title: "Price",
      field: "price",
      render: (data) => `$ ${data?.price}`,
    },
    {
      title: "Discount Price",
      field: "discount_price",
      render: (data) => `$ ${data?.discount_price}`,
    },
    {
      title: "Stock Qty",
      field: "stock_amount",
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
    setLocalData(accessToken);
  }, [accessToken]);

  const handleAdd = (e) => {
    e.preventDefault();
    navigate("/addproduct");
  };

  const handleEdit = (e, slug) => {
    e.preventDefault();
    const editData = data.find((element) => element.slug === slug);
    setSlug(slug);
    setImageToEdit(JSON.parse(editData.images));
    setDataToEdit({ ...editData, images: [] });
  };

  const handleViewDetail = (e, slug) => {
    e.preventDefault();
    navigate(`/productdetail/${slug}`);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDataToEdit({ ...dataToEdit, [name]: value });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/category/getallcategory`,
    })
      .then((res) => {
        setResponse(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_URL}/product/${slug}`,
      headers: {
        authorization: `Bearer ${localData}`,
      },
      data: {
        title: dataToEdit?.title,
        cover_image: dataToEdit?.cover_image,
        price: dataToEdit?.price,
        category_id: dataToEdit?.category_id,
        images: imageToEdit,
        discount_price: dataToEdit?.discount_price,
        description: dataToEdit?.description,
        stock_amount: dataToEdit?.stock_amount,
      },
    })
      .then((res) => {
        setSuccessMessage(res?.data?.message);
        closeModal();
        setReload(!reload);
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
    setDataToDelete(data.find((element) => element.slug === slug));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/product/${slug}`,
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
        // console.log(err);
        setErrorMessage(err?.response?.data?.message);
        setSuccessShow(false);
        setErrorShow(true);
      });
  };

  const imageAdd = (e) => {
    e.preventDefault();
    setImageToEdit([...imageToEdit, dataToEdit.images]);
    setDataToEdit({ ...dataToEdit, images: [] });
  };

  const handleImageDelete = (e, index) => {
    e.preventDefault();
    setImageToEdit(imageToEdit.filter((element, keys) => keys !== index));
  };

  const closeModal = () => {
    const closeButton = document.getElementById("closeModal");
    closeButton.click();
  };

  return (
    <>
      <div className="container product-table mt-5">
        <div className="product-button mb-3">
          {props.hideAddButton ? (
            <p className="page-heading">{props.title} Category</p>
          ) : (
            <p className="page-heading">Product List</p>
          )}
          <button
            className={props.hideAddButton === true ? "d-none" : "product-btn"}
            onClick={(e) => handleAdd(e)}
          >
            <i className="fa-solid fa-plus"></i> <span>Add Product </span>
          </button>
        </div>
        <Table
          headers={header}
          data={props.data ? props.data : data}
          action={action}
          loader={loader}
        />
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
                Delete Product
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Do you want to delete this Product?
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

      <ProductEditModal
        handleChange={(e) => handleChange(e)}
        dataToEdit={dataToEdit}
        response={response}
        imageToEdit={imageToEdit}
        handleUpdate={(e) => handleUpdate(e)}
        handleImageDelete={(e, index) => {
          handleImageDelete(e, index);
        }}
        imageAdd={(e) => {
          imageAdd(e);
        }}
      />

      {/* <div
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
                Edit Product
              </h1>
              <button
                type="button"
                id="closeModal"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
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
                      Cover Image <Validation />
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlCover"
                      name="cover_image"
                      value={dataToEdit.cover_image}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    {dataToEdit.cover_image ? (
                      <img
                        src={dataToEdit.cover_image}
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
                    <label htmlFor="formControlPrice" className="form-label">
                      Price <Validation />
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlPrice"
                      name="price"
                      value={dataToEdit.price}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div className="col-6 my-3">
                    <label htmlFor="formControlDiscout" className="form-label">
                      Discount Price
                    </label>
                    <input
                      type="text"
                      className="form-control input-field addProductDiscount"
                      id="formControlDiscount"
                      name="discount_price"
                      value={dataToEdit.discount_price}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 dropdown my-3">
                    <div className="category-dropdown">
                      <label
                        htmlFor="formControlCategory"
                        className="form-label"
                      >
                        Select Category <Validation />
                      </label>
                      <select
                        className="dropdown-input form-control"
                        id="formControlCategory"
                        value={dataToEdit.category_id}
                        name="category_id"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        <option value=""> Select Category</option>
                        {response.map((element, keys) => {
                          return (
                            <option
                              className="category-options"
                              key={keys}
                              value={element.id}
                            >
                              {" "}
                              {element.title}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-6 my-3">
                    <label htmlFor="formControlStock" className="form-label">
                      Stock Amount
                    </label>
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlStock"
                      name="stock_amount"
                      value={dataToEdit.stock_amount}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
                <div className="my-3">
                  <label htmlFor="formControlImage" className="form-label">
                    Images
                  </label>
                  <div className=" input-image">
                    <input
                      type="text"
                      className="form-control input-field"
                      id="formControlImage"
                      name="images"
                      value={dataToEdit?.images}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      placeholder="Enter images URL's"
                    />
                    <div className="image-add-icon">
                      {" "}
                      <i
                        className="fa-solid fa-plus"
                        onClick={(e) => {
                          imageAdd(e);
                        }}
                      ></i>{" "}
                    </div>
                  </div>
                  <div>
                    {imageToEdit.map((element, index) => {
                      return (
                        <div className="input-mapped-image mt-2" key={index}>
                          {element ? (
                            <>
                              <div className="input-mapped-images">
                                <img
                                  src={element}
                                  alt=""
                                  height="100px"
                                  width="100px"
                                />
                                <div className="mapped-cross-icon">
                                  <i
                                    className="fa-sharp fa-solid fa-circle-xmark"
                                    onClick={(e) => {
                                      handleImageDelete(e, index);
                                    }}
                                  ></i>
                                </div>
                              </div>{" "}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
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
      </div> */}
    </>
  );
};

export default Product;
