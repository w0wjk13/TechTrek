import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/study/:id">상세페이지</Link>
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
    </>
  );
};
