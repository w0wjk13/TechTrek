import React, { useState } from "react";
import { Meteor } from "meteor/meteor";


export default function LoginFwFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleFindPassword = (e) => {
    e.preventDefault();

    // 서버 메서드 호출
    Meteor.call("findUserPassword", name, email, phone, (error, result) => {
      if (error) {
        alert("에러가 발생했습니다: " + error.reason);
      } else if (result) {
        alert("비밀번호는: " + result);
      } else {
        alert("해당 정보로 등록된 비밀번호가 없습니다.");
      }
    });
  };

  return (
    <div className="login-idfind-container">
      <div className="login-idfind-header">
        <h2 className="login-idfind-title">비밀번호 찾기</h2>
      </div>
      <form onSubmit={handleFindPassword} className="login-idfind-form">
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
        <div className="login-idfind-form-group">
          <label className="login-idfind-label">
            아이디(이메일):
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-idfind-input"
            />
          </label>
        </div>
        <button type="submit" className="login-idfind-button">비밀번호 찾기</button>
      </form>
    </div>
  );
}
