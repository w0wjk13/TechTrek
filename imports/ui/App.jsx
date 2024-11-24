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
import InfoProject from "./mypage/InfoProject";
import PeopleList from "./mypage/PeopleList";

// PrivateRoute 컴포넌트: 로그인 여부에 따라 보호된 경로에 접근을 제어
const PrivateRoute = ({ element }) => {
  const userId = Meteor.userId(); // 로그인된 사용자의 ID
  if (!userId) {
    // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
    return <Navigate to="/login/main" replace />;
  }
  return element; // 로그인한 사용자는 해당 컴포넌트를 렌더링
};

export const App = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        {/* 홈 페이지는 로그인 여부와 상관없이 접근 가능 */}
        <Route path="/" element={<Home />} />

        {/* 로그인 페이지들 */}
        <Route path="/login">
          <Route path="main" element={<LoginMain />} />
          <Route path="form" element={<LoginForm />} />
          <Route path="idfind" element={<LoginIdFind />} />
          <Route path="fwfind" element={<LoginFwFind />} />
        </Route>

        {/* 보호된 페이지들 */}
        <Route
          path="/mypage"
          element={<PrivateRoute element={<MyProfile />} />}
        />
        <Route
          path="/mypage/:userId"
          element={<PrivateRoute element={<MyProfile />} />}
        />
        <Route
          path="/mypage/myproject"
          element={<PrivateRoute element={<MyProject />} />}
        />
        <Route
          path="/mypage/editProfile"
          element={<PrivateRoute element={<EditProfile />} />}
        />
        <Route
          path="/mypage/info/:studyId"
          element={<PrivateRoute element={<InfoProject />} />}
        />
        <Route
          path="/mypage/peopleList/:studyId"
          element={<PrivateRoute element={<PeopleList />} />}
        />
        <Route
          path="/study/:id"
          element={<PrivateRoute element={<DetailStudy />} />}
        />
        <Route
          path="/uploadstudy"
          element={<PrivateRoute element={<UploadStudy />} />}
        />
        <Route
          path="/uploadstudy/:id"
          element={<PrivateRoute element={<UploadStudy />} />}
        />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
