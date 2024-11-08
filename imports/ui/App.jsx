import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Nav from "./Nav.jsx";
import PostDetail from "./PostDetail.jsx";
import TestPage from './TestPage.jsx';

export const App = () => (
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/testpage" element={<TestPage />}></Route>
      <Route path="/postDetail/:_id" element={<PostDetail />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  </Router>
);
