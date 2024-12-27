import React from 'react';
import { Link } from 'react-router-dom';
import "../../../client/css/mypage/MypageNav.css";

const Navbar = () => {
  return (
    <div className="mypage-navbar-container">
      <nav className="mypage-navbar">
        <ul className="mypage-navbar-list">
          <li className="mypage-navbar-item">
            <Link to="/mypage/main" className="mypage-navbar-link">마이 페이지</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/user" className="mypage-navbar-link">회원정보 수정</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/project" className="mypage-navbar-link">프로젝트</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/comment" className="mypage-navbar-link">코멘트</Link>
          </li>
          <li className="mypage-navbar-item">
            <Link to="/mypage/rating" className="mypage-navbar-link">내평가</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
