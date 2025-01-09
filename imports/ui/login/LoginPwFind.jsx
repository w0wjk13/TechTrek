import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";  // useNavigate로 변경

export default function LoginFwFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  const handleFindPassword = (e) => {
    e.preventDefault();

    // 서버 메서드 호출
    Meteor.call("findUserPassword", name, email, phone, (error, result) => {
      if (error) {
        alert(`${error.reason}`); // 에러 메시지 alert로 띄우기
      } else if (result) {
        alert(result); // 이메일 전송 완료 메시지 alert로 띄우기
        navigate("/login/main"); // 비밀번호 찾기 성공 후 로그인 페이지로 이동
      }
    });
  };

  return (
    <div className="login-pwfind-container">

    <form onSubmit={handleFindPassword} className="login-pwfind-form">
      <div className="login-pwfind-form-group">
      <div className="login-pwfind-header">
      <h2 className="login-pwfind-title">비밀번호 찾기</h2>
    </div>
        <label className="login-pwfind-label">
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="login-pwfind-input" placeholder="이름"
          />
        </label>
      </div>
      <div className="login-pwfind-form-group">
        <label className="login-pwfind-label">
        
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="login-pwfind-input" placeholder="연락처"
          />
        </label>
      </div>
      <div className="login-pwfind-form-group">
        <label className="login-pwfind-label">
  
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-pwfind-input" placeholder="이메일"
          />
        </label>
      </div>
      <button type="submit" className="login-pwfind-button">비밀번호 찾기</button>
    </form>
  </div>
  );
}