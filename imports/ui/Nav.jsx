import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import "../../client/css/Nav.css";

export default () => {
  // 로그인 상태를 추적
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });

  const navigate = useNavigate();  // useNavigate 훅을 사용하여 리디렉션

  const handleLogout = () => {
    Meteor.logout(() => {
      // 로그아웃 후 로그인 페이지로 리디렉션
      navigate('/login/main');  // 로그인 페이지 경로로 리디렉션
    });
  };

  return (
    <>
    <header>
        <nav className="navbar">
          <div className="navbar-container">
            {/* TechTrek 로고 디자인 */}
            <div>
              <Link to="/" className="techtrek-logo">
                TechTrek
              </Link>
            </div>

            {/* 메뉴 항목들 */}
            <div className="navbar-links">
              <Link to="/study/form" className="nav-link study-create-link">
                스터디 생성
              </Link>
              <Link to="/mypage/main" className="nav-link mypage-link">
                마이페이지
              </Link>

              {/* 로그인 상태에 따른 메뉴 변경 */}
              {user ? (
                <Link
                  to="#"
                  className="nav-link logout-link"
                  onClick={handleLogout}
                >
                  로그아웃
                </Link>
              ) : (
                <Link to="/login/main" className="nav-link login-link">
                  로그인
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      <br /> 
    </>
  );
};
