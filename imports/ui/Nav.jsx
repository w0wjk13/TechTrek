import React from "react";
import { Link } from "react-router-dom";
import "./css/Nav.css";  // CSS 파일을 import

export default () => {
  return (
    <>
      <header>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/login/main" className="nav-link">Login</Link>
            </li>


          </ul>
        </nav>
      </header>
      <br />  <hr />  <br />
    </>
  );
};
