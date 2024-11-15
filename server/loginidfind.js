import React, { useState } from "react";
import { Meteor } from "meteor/meteor";


export default function LoginIdFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");  // 결과 메시지 상태 추가
  const [messageType, setMessageType] = useState("");  // 메시지 유형 (성공/실패)

  const handleSubmit = (e) => {
    e.preventDefault();

    // Meteor.call로 서버의 'findUserID' 메서드를 호출
    Meteor.call("findUserID", name, phone, (error, result) => {
      if (error) {
        // 에러 발생 시 메시지 설정
        if (error.error === 'user-not-found') {
          setMessage(error.reason);
          setMessageType("error");  // 에러 메시지로 표시
        } else {
          setMessage("에러가 발생했습니다: " + error.message);
          setMessageType("error");
        }
      } else if (result) {
        // 아이디가 있으면 이메일 주소를 결과로 표시
        setMessage("아이디는: " + result);
        setMessageType("success");  // 성공 메시지로 표시
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

      {/* 버튼 아래에 메시지 출력 */}
      {message && (
        <div className={`login-idfind-message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}
