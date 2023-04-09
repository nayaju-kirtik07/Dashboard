import React from "react";
import { Routes, Route } from "react-router-dom";
import AddBanner from "./AddBanner";
import AddCategory from "./AddCategory";
import AddProduct from "./AddProduct";
import AddTeams from "./AddTeams";
import Banner from "./Banner";
import BannerDetails from "./BannerDetails";
import Category from "./Category";
import Home from "./Home";
import Layout from "./Layout";
import Login from "./Login";
import Product from "./Product";
import ProductDetails from "./ProductDetails";
import TeamDetail from "./TeamDetail";
import Teams from "./Teams";
import ViewProduct from "./ViewProduct";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route index element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/productdetail/:slug" element={<ProductDetails />} />
          <Route path="/category" element={<Category />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/category/:slug" element={<ViewProduct />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/addbanner" element={<AddBanner />} />
          <Route path="/banner/:slug" element={<BannerDetails />} />
          <Route path="/team" element={<Teams />} />
          <Route path="/addteam" element={<AddTeams />} />
          <Route path="/team/:slug" element={<TeamDetail />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AllRoutes;
