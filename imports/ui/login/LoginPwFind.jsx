import React, { useState } from "react";
import { Meteor } from "meteor/meteor";

export default function LoginFwFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleFindPassword = (e) => {
    e.preventDefault();

    Meteor.call("findUserPassword", name, phone, email, (error, result) => {
      if (error) {
        alert("에러가 발생했습니다: " + error.message);
      } else if (result) {
        alert("비밀번호는: " + result);
      } else {
        alert("해당 정보로 등록된 비밀번호가 없습니다.");
      }
    });
  };

  return (
    <div>
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleFindPassword}>
        <label>
          이름:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          연락처:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          아이디(이메일):
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">비밀번호 찾기</button>
      </form>
    </div>
  );
}
