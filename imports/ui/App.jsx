// App.jsx 파일
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Nav from "./Nav.jsx";
import LoginForm from "./login/LoginForm.jsx";
import LoginIdFind from "./login/LoginIdFind.jsx";
import LoginFwFind from "./login/LoginPwFind.jsx";
import LoginMain from "./login/LoginMain.jsx";
import UploadStudy from "./uploadStudy/UploadStudy";
import MyPageMain from "./mypage/MypageMain.jsx";


export const App = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login">
        <Route path="main" element={<LoginMain />} />
        <Route path="form" element={<LoginForm />} />
        <Route path="idfind" element={<LoginIdFind />} />
        <Route path="fwfind" element={<LoginFwFind />} />
      </Route>
      <Route path="/mypage">
        <Route path="main" element={<MyPageMain />} />
      </Route>
      <Route path="/uploadStudy" element={<UploadStudy />} />
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  </Router>
);
