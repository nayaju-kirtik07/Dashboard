import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const TeamDetail = () => {
  const { slug } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    if (slug) {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/profile/getsingleprofile/${slug}`,
      })
        .then((res) => {
          setData(res?.data?.data);
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
          <div className="col-5 product-image">
            <img
              className="single-image mx-4"
              src={data?.image}
              alt={data?.name}
              height="400"
              width="450px"
            />
          </div>

          <div className="col-7 product-detail">
            <div>
            <h1 className="detail-title">{data?.name}</h1>
            </div> <br/>

            <div className="detail-description mt5">
              <h3>Team Details :</h3> 
              <p>{data?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
