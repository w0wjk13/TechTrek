import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/postList">Posts</Link>
            </li>
            <li>
              <Link to="/postInsert">Post</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Nav;
