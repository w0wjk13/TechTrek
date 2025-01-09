import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate, useLocation } from "react-router-dom"; 

export default () => {
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });

  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
  const location = useLocation(); // 현재 경로를 받아오기 위해 useLocation 사용
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  // 로그인 처리 함수
  const handleLogin = () => {
    Meteor.loginWithPassword(refEmail.current.value, refPassword.current.value, (error) => {
      if (error) {
        console.log("Login failed:", error);
      } else {
        // 로그인 성공 시, 이전 페이지로 리디렉션
        const from = location.state?.from || '/';  // 원래 접근하려던 페이지가 있다면 그 페이지로, 없으면 홈 페이지로
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <div className="loginmain-container">
      <div className="loginmain-box">
        {user ? (
          <div className="loginmain-logout-button">
            <button
              onClick={() => {
                Meteor.logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="loginmain-login-form">
            <input ref={refEmail} type="text" className="loginmain-input-field" placeholder="Email" /><br />
            <input ref={refPassword} type="password" className="loginmain-input-field" placeholder="Password" /><br />
            <button onClick={handleLogin} className="loginmain-login-button">Login</button>
          </div>
        )}
        <div className="loginmain-additional-links">
          <Link to="/login/idfind" className="loginmain-link">아이디 찾기</Link> |&nbsp;
          <Link to="/login/fwfind" className="loginmain-link">비밀번호 찾기</Link> |&nbsp;
          <Link to="/login/form" className="loginmain-link">회원가입</Link>
        </div>
      </div>
    </div>
  );
};
