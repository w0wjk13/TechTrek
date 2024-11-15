import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
//import '../../client/css/LoginFind.css';  // CSS 파일을 import

export default function LoginIdFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Meteor.call로 서버의 'findUserID' 메서드를 호출
    Meteor.call("findUserID", name, phone, (error, result) => {
      if (error) {
        // 에러가 발생하면 에러 메시지를 출력
        if (error.error === 'user-not-found') {
          alert(error.reason);
        } else {
          alert("에러가 발생했습니다: " + error.message);
        }
      } else if (result) {
        // 아이디가 있으면 이메일 주소를 표시
        alert("아이디는: " + result);
      }
    });
  };

  return (
    <div className="login-idfind-container">
      <div className="login-idfind-header">
        <h2 className="login-idfind-title">아이디 찾기</h2>
      </div>
      <form onSubmit={handleSubmit} className="login-idfind-form">
        <div className="login-idfind-form-group">
          <label className="login-idfind-label">
            이름:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="login-idfind-input"
            />
          </label>
        </div>
        <div className="login-idfind-form-group">
          <label className="login-idfind-label">
            연락처:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="login-idfind-input"
            />
          </label>
        </div>
        <button type="submit" className="login-idfind-button">아이디 찾기</button>
      </form>
    </div>
  );
}
