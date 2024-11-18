import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadStudy from "./uploadStudy/UploadStudy";
import NotFound from "./NotFound";
import Nav from "./Nav";
import DetailStudy from "./uploadStudy/DetailStudy";
import MyPageNav from "./myPage/MyPageNav";

export const App = () => (
  <Router>
    <Nav />
    <Routes>
      //App 합치기 위해 올림
      <Route path="/mypage/*" element={<MyPageNav />} />
      <Route path="/study/:id" element={<DetailStudy />} />
      <Route path="*" element={<NotFound />}></Route>
      <Route path="/uploadStudy" element={<UploadStudy />} />
    </Routes>
  </Router>
);
