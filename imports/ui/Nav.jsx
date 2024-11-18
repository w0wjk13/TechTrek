import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

export default () => {
  // 로그인 상태를 추적
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });

  return (
    <>
      <header>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/uploadStudy" className="nav-link">
                스터디 생성
              </Link>
            </li>
            {/* 로그인한 유저만 Mypage로 접근 가능, 로그인 안 했으면 로그인 페이지로 이동 */}
            <li className="nav-item">
              {user ? (
                <Link to="/mypage/main" className="nav-link">
                  Mypage
                </Link>
              ) : (
                <Link to="/login/main" className="nav-link">
                  Mypage
                </Link>
              )}
            </li>
            {/* 로그인 상태에 따라 메뉴 변경 */}
            {user ? (
              <li className="nav-item">
                <button
                  className="nav-link logout-button"
                  onClick={() => Meteor.logout()}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login/main" className="nav-link">
                  Login
                </Link>
              </li>
            )}


          </ul>
        </nav>
      </header>
      <br /> <hr /> <br />
    </>
  );
};
