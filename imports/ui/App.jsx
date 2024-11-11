import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
