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
    </>
  );
};
