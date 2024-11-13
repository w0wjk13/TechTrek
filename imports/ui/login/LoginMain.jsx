import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import "../css/LoginMain.css";
import { Link } from "react-router-dom";

export default () => {
  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });

  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const handleLogin = () => {
    const rslt = Meteor.loginWithPassword(
      refEmail.current.value,
      refPassword.current.value
    );
    console.log(rslt);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {user ? (
          <div className="logout-button">
            <button
              onClick={() => {
                Meteor.logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="login-form">
            <input ref={refEmail} type="text" className="input-field" placeholder="Email" /><br />
            <input ref={refPassword} type="password" className="input-field" placeholder="Password" /><br />
            <button onClick={handleLogin} className="login-button">Login</button>
          </div>
        )}
        <div className="additional-links">
          <Link to="/login/idfind">아이디 찾기</Link> |&nbsp;
          <Link to="/login/fwfind">비밀번호 찾기</Link> |&nbsp;
          <Link to="/login/form">회원가입</Link>
        </div>
      </div>
    </div>
  );
};
