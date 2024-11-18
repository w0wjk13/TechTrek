import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadStudy from "./uploadstudy/UploadStudy";
import NotFound from "./NotFound";
import Nav from "./Nav";
import DetailStudy from "./uploadstudy/DetailStudy";
import MyPageNav from "./mypage/MyPageNav";

export const App = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/mypage/*" element={<MyPageNav />} />
      <Route path="/study/:id" element={<DetailStudy />} />
      <Route path="*" element={<NotFound />}></Route>
      <Route path="/uploadStudy" element={<UploadStudy />} />
    </Routes>
  </Router>
);
