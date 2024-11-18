import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Routes, Route, Link } from "react-router-dom";
import MyProfile from "./MyProfile";
import MyProject from "./MyProject";

const MyPageNav = () => {
  return (
    <>
      <div>
        <li>
          <Link to="/mypage/profile">프로필</Link>
        </li>
        <li>
          <Link to="/mypage/project">프로젝트</Link>
        </li>
      </div>
      <div>
        <Routes>
          <Route path="profile" element={<MyProfile />} />
          <Route path="project" element={<MyProject />} />
        </Routes>
      </div>
    </>
  );
};

export default MyPageNav;
