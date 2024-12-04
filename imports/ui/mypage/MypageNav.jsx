import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/mypage/main">마이 페이지</Link>
        </li>
        <li>
          <Link to="/mypage/user">회원정보 수정</Link>
        </li>
        <li>
          <Link to="/mypage/project">프로젝트</Link>
        </li>
        <li>
          <Link to="/mypage/comment">코멘트</Link>
        </li>

      </ul>
    </div>
  );
};

export default Navbar;
