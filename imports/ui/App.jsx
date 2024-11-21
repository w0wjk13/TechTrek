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

const App = () => {
  const { loggingIn, user } = useTracker(() => ({
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  }));
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 로그인 페이지들 */}
        <Route path="/login">
          <Route path="main" element={<LoginMain />} />
          <Route path="form" element={<LoginForm />} />
          <Route path="idfind" element={<LoginIdFind />} />
          <Route path="fwfind" element={<LoginFwFind />} />
        </Route>

        {/* 로그인하지 않은 사용자에게만 리디렉션 처리 */}
        {!user ? (
          <>
            <Route path="/mypage" element={<MyProfile />} />
            <Route path="/mypage/:userId" element={<MyProfile />} />
            <Route path="/mypage/myproject" element={<MyProject />} />
            <Route path="/mypage/editProfile" element={<EditProfile />} />
            <Route path="/mypage/info/:studyId" element={<InfoProject />} />
            <Route path="/mypage/peopleList/:studyId" element={<PeopleList />} />
            <Route path="/study/:id" element={<DetailStudy />} />
            <Route path="/uploadstudy/uploadstudy" element={<UploadStudy />} />
            <Route path="*" element={<Navigate to="/login/main" replace />} />
          </>
        ) : (
          <>
            {/* 로그인된 사용자에게만 접근 가능한 페이지들 */}
            <Route path="/mypage" element={<MyProfile />} />
            <Route path="/mypage/:userId" element={<MyProfile />} />
            <Route path="/mypage/myproject" element={<MyProject />} />
            <Route path="/mypage/editProfile" element={<EditProfile />} />
            <Route path="/mypage/info/:studyId" element={<InfoProject />} />
            <Route path="/mypage/peopleList/:studyId" element={<PeopleList />} />
            <Route path="/study/:id" element={<DetailStudy />} />
            <Route path="/uploadstudy/uploadstudy" element={<UploadStudy />} />
          </>
        )}

        {/* 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;