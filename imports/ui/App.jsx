import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";

import Nav from "./Nav.jsx";
import LoginForm from "./login/LoginForm.jsx";
import LoginIdFind from "./login/LoginIdFind.jsx";
import LoginFwFind from "./login/LoginPwFind.jsx";
import LoginMain from "./login/LoginMain.jsx";

import UploadStudy from "./uploadstudy/UploadStudy";
import DetailStudy from "./uploadstudy/DetailStudy";
import MyProfile from "./mypage/MyProfile";
import EditProfile from "./mypage/EditProfile";
import MyProject from "./mypage/MyProject";

export const App = () => {
  // 로그인 상태를 확인
  const { user } = useTracker(() => ({
    user: Meteor.user(),
  }));

  return (
    <Router>
      <Nav />
      <Routes>
        {/* 홈 페이지는 로그인하지 않은 사용자도 접근 가능 */}
        <Route path="/" element={<Home />} />

        {/* 로그인 페이지들 */}
        <Route path="/login">
          <Route path="main" element={<LoginMain />} />
          <Route path="form" element={<LoginForm />} />
          <Route path="idfind" element={<LoginIdFind />} />
          <Route path="fwfind" element={<LoginFwFind />} />
        </Route>

        {/* 로그인하지 않은 사용자가 접근하려는 페이지는 로그인 페이지로 리디렉션 */}
        <Route
          path="/mypage/*"

          element={user ? <MyPageNav /> : <Navigate to="/login/main" state={{ from: "/mypage" }} replace />}

          element={user ? <MyProfile /> : <Navigate to="/login/main" replace />}
        />
        <Route
          path="/mypage/myproject"
          element={user ? <MyProject /> : <Navigate to="/login/main" replace />}
        />
        <Route
          path="/mypage/editProfile"
          element={
            user ? <EditProfile /> : <Navigate to="/login/main" replace />
          }

        />
        <Route
          path="/study/:id"

          element={user ? <DetailStudy /> : <Navigate to="/login/main" state={{ from: "/study/:id" }} replace />}
        />
        <Route
          path="/uploadstudy/uploadstudy"
          element={user ? <UploadStudy /> : <Navigate to="/login/main" state={{ from: "/uploadstudy/uploadstudy" }} replace />}

        />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
