import React from "react";
import { Link } from "react-router-dom";

const MyProject = () => {
  return (
    <div>
      <li>
        <Link to="/mypage">프로필</Link>
      </li>
      <li>
        <Link to="/mypage/myproject">프로젝트</Link>
      </li>
    </div>
  );
};

export default MyProject;
