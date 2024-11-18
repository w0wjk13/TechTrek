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
import Home from "./Home";
import NotFound from "./NotFound";
import Nav from "./Nav";
import PostDetail from "./PostDetail";

export const App = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/postDetail/:_id" element={<PostDetail />}></Route>
      <Route path="*" element={<NotFound />}></Route>
      <Route path="/uploadStudy" element={<UploadStudy />} />
    </Routes>
  </Router>
);
