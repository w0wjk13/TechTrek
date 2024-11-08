import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Nav from "./Nav.jsx";
import PostList from "./PostList.jsx";
import PostInsert from "./PostInsert.jsx";
import PostDetail from "./PostDetail.jsx";

export const App = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/postList" element={<PostList />}></Route>
      <Route path="/postInsert" element={<PostInsert></PostInsert>}></Route>
      <Route
        path="/postDetail/:_id"
        element={<PostDetail></PostDetail>}
      ></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  </Router>
);
