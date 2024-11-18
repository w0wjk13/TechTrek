import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useNavigate, useLocation } from "react-router-dom";  // useLocation 추가

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
    <div className="login-container">
      <div className="login-box">
        {user ? (
          <div className="logout-button">
            <button
              onClick={() => {
                Meteor.logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="login-form">
            <input ref={refEmail} type="text" className="input-field" placeholder="Email" /><br />
            <input ref={refPassword} type="password" className="input-field" placeholder="Password" /><br />
            <button onClick={handleLogin} className="login-button">Login</button>
          </div>
        )}
        <div className="additional-links">
          <Link to="/login/idfind">아이디 찾기</Link> |&nbsp;
          <Link to="/login/fwfind">비밀번호 찾기</Link> |&nbsp;
          <Link to="/login/form">회원가입</Link>
        </div>
      </div>
    </div>
  );
};
