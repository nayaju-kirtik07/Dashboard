import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const BannerDetails = () => {
  const { slug } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    if (slug) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/banner/getsinglebanner/${slug}`,
      })
        .then((res) => {
          setData(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [slug]);
  return (
    <div>
      <div className="container single-items">
        <div className="row">
          <div className="col-5">
            <img
              className="single-image mx-4"
              src={data?.image}
              alt=""
              height="400px"
              width="450px"
            />
          </div>

          <div className="col-7">
            <div className="row mb-5">
              <div className="col-6">
                <h3 className="detail-title">{data?.title}</h3>
              </div>

              <div className="col-6">
                {/* <p className="detail-price pt-3">
                  ${data?.price}
                  <span className="detail-discount ps-3">
                    ${data?.discount_price}
                  </span>{" "}
                </p> */}
                {/* <p className="detail-stock">
                  Stock Available : {data?.stock_amount}
                </p> */}
              </div>
            </div>

            <div className="detail-description mt5">
              <h3>Banner Description :</h3> 
              <p>{data?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetails;
