import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Product from "./Product"

const ViewProduct = () => {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [hideAddButton , setHideAddButton] = useState(false);

  useEffect(() => {
    if (slug) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/category/${slug}`,
      })
        .then((res) => {
          setCategory(res?.data?.data[0]?.title);
          setData(res?.data?.data[0].products);
          setHideAddButton(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [slug]);

  return (
    <div>
      <Product data={data} hideAddButton={hideAddButton} title={category} />
    </div>
  );
};

export default ViewProduct;
