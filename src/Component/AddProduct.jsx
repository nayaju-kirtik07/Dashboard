import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Validation";
import { useContext } from "react";
import { Context } from "../Context/ToastContext";
import { AuthenticationContext } from "../Context/AuthContext";

const AddProduct = () => {
  const { setSuccessMessage, setErrorMessage, setSuccessShow, setErrorShow } =
    useContext(Context);
    const {accessToken} = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const initialData = {
    title: "",
    images: "",
    price: "",
    discount_price: "",
    stock_amount: "",
    category_id: "",
    cover_image: "",
    description: "",
  };

  const [data, setdata] = useState(initialData);
  const [localData, setLocalData] = useState([]);
  const [inputImage, setInputImage] = useState([]);
  const [response, setResponse] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
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

  useEffect(() => {
    setLocalData(accessToken);
  }, [accessToken]);

  const handleAdd = (e) => {
    e.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/product/addproduct`,
      data: {
        ...data,
        images: inputImage,
      },
      headers: {
        authorization: `Bearer ${localData}`,
      },
    })
      .then((res) => {
        setSuccessMessage(res?.data?.message);
        setdata(initialData);
        setInputImage([]);
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
    setInputImage([...inputImage, data.images]);
    setdata({ ...data, images: "" });
  };

  const handleImageDelete = (e, index) => {
    e.preventDefault();
    setInputImage(inputImage.filter((element, keys) => keys !== index));
  };

  return (
    <div>
      <div className="container add-form my-5 p-3">
        <h1 className="addProductHeading">Add Product</h1>
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
                Cover Image <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field"
                id="formControlCover"
                name="cover_image"
                value={data.cover_image}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter image URL"
              />
              <div className="inputCoverImage">
                {data.cover_image ? (
                  <img
                    src={data.cover_image}
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
          <div className="row">
            <div className="col-6 my-3">
              <label htmlFor="formControlPrice" className="form-label">
                Price <Validation />
              </label>
              <input
                type="text"
                className="form-control input-field addProductPrice"
                id="formControlPrice"
                name="price"
                value={data.price}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Product Price"
              />
            </div>
            <div className=" col-6 my-3">
              <label htmlFor="formControlDiscout" className="form-label">
                Discount Price
              </label>
              <input
                type="text"
                className="form-control input-field addProductDiscount"
                id="formControlDiscount"
                name="discount_price"
                value={data.discount_price}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Enter Discount Price"
              />
            </div>
            <div className="row">
              <div className="col-6 dropdown my-3">
                <div className="category-dropdown">
                  <label htmlFor="formControlCategory" className="form-label">
                    Select Category <Validation />
                  </label>
                  <select
                    className="dropdown-input form-control"
                    value={data.category_id}
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
              <div className=" col-6 my-3">
                <label htmlFor="formControlStock" className="form-label">
                  Stock Amount
                </label>
                <input
                  type="text"
                  className="form-control input-field"
                  id="formControlStock"
                  name="stock_amount"
                  value={data.stock_amount}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  placeholder="Enter Stock Quantity"
                />
              </div>
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
                value={data.images}
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
              {inputImage?.map((element, index) => {
                return (
                  <div className="input-mapped-image mt-2">
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
              placeholder="Enter Product Details"
            />
          </div>
        </form>
        <div className="add-button">
          <button className="product-btn" onClick={(e) => handleAdd(e)}>
            <i className="fa-solid fa-plus"></i> <span>Add Product </span>
          </button>

          <button
            className="btn btn-light ms-3"
            onClick={() => {
              navigate("/product");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
