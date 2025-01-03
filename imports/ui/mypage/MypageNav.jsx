import React from 'react';
import { Link } from 'react-router-dom';
import "../../../client/css/mypage/MypageNav.css";

const Navbar = () => {
  return (
    <div className="mypage-navbar-container">
      <nav className="mypage-navbar">
        <ul className="mypage-navbar-list">
          <li className="mypage-navbar-item">
            <Link to="/mypage/main" className="mypage-navbar-link">이력</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/user" className="mypage-navbar-link">회원정보</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/project" className="mypage-navbar-link">프로젝트</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/comment" className="mypage-navbar-link">댓글</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/rating" className="mypage-navbar-link">평가</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
