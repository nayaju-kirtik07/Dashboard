import React from "react";
import { useEffect } from "react";
import axios from "axios";
// import { useContext } from "react";
// import { AuthenticationContext } from "../Context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/summary/getsummary`,
    })
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBanner = (e) => {
    e.preventDefault();
    navigate("/banner");
  };
  const handleCategory = (e) => {
    e.preventDefault();
    navigate("/category");
  };

  const handleProduct = (e) => {
    e.preventDefault();
    navigate("/product");
  };

  const handleTeam = (e) => {
    e.preventDefault();
    navigate("/team");
  };

  return (
    <div className="container-fluid">
      <div className="container dashboard-page">
        <div className="row homepage-cards">
          <div className="col-2 number-count banner-count" onClick={(e) => handleBanner(e)}>
            <p className="summary-count">{data.bannerCount}</p>
            <p>Banner</p>
          </div>
          <div
            className="col-2 number-count category-count"
            onClick={(e) => {
              handleCategory(e);
            }}
          >
            <p className="summary-count">{data.categoryCount}</p>
            <p>Category </p>
          </div>
          <div
            className="col-2 number-count product-count"
            onClick={(e) => {
              handleProduct(e);
            }}
          >
            <p className="summary-count">{data.productCount}</p>
            <p>Product</p>
          </div>
          <div
            className="col-2 number-count team-count"
            onClick={(e) => {
              handleTeam(e);
            }}
          >
            <p className="summary-count">{data.teamCount}</p>
            <p>Team</p>
          </div>
          {/* <div className="col-2 number-count">
            <p className="summary-count">{data.userCount}</p>
            <p>User</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
