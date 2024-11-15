import React from "react";
import { Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import "./css/Nav.css"; // CSS 파일을 import

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
            <li>
              <Link to="/postDetail/testID">DetailPage</Link>
            </li>
            <li>
              <Link to="/postInsert">NotFound</Link>
            </li>
            <li>
              <Link to="/uploadStudy">스터디 생성</Link>
            </li>
          </ul>
        </nav>
      </header>
      <br /> <hr /> <br />
    </>
  );
};
