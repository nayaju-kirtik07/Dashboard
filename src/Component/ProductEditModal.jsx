import React from "react";
import Validation from "./Validation";

const ProductEditModal = ({
  dataToEdit,
  handleChange,
  response,
  imageToEdit,
  handleUpdate,
  handleImageDelete,
  imageAdd,
}) => {
  return (
    <div>
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
                Edit Product
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                        onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      placeholder="Enter images URL's"
                    />
                    <div className="image-add-icon">
                      {" "}
                      <i
                        className="fa-solid fa-plus"
                        onClick={imageAdd}
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
                                    onClick={(e) => {handleImageDelete(e,index)}}
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
                    onChange={handleChange}
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
                onClick={handleUpdate}
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

export default ProductEditModal;
