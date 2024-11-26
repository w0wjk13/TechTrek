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
              <Link to="/study/form" className="nav-link">
                스터디 생성
              </Link>
            </li>

            <li className="nav-item">

              <Link to="/mypage" className="nav-link">
                마이페이지
              </Link>

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