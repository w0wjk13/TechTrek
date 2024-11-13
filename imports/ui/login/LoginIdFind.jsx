import React, { useState } from "react";
import { Meteor } from "meteor/meteor";

export default function LoginIdFind() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.call("findUserID", name, phone, (error, result) => {
      if (error) {
        alert("에러가 발생했습니다: " + error.message);
      } else if (result) {
        alert("아이디는: " + result);
      } else {
        alert("해당 정보로 등록된 아이디가 없습니다.");
      }
    });
  };

  return (
    <div>
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">아이디 찾기</button>
      </form>
    </div>
  );
}
