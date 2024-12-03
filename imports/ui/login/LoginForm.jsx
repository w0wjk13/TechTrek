import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import Data from "./../Data";

const { techStacks } = Data;


const positions = ["백엔드", "프론트엔드", "풀스택"];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(""); // 이름 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [techStack, setTechStack] = useState([]); // 기술 스택 상태
  const [position, setPosition] = useState(""); // 포지션 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [profilePicture, setProfilePicture] = useState(null); // 프로필 사진 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // 파일을 base64로 저장
      };
      reader.readAsDataURL(file); // base64로 읽기
    }
  };

  // 기술 스택 선택/취소 핸들러
  const handleTechStackClick = (stack) => {
    setTechStack((prevTechStack) => {
      if (prevTechStack.includes(stack)) {
        // 이미 선택된 기술 스택이라면 제거
        return prevTechStack.filter((item) => item !== stack);
      } else if (prevTechStack.length < 5) {
        // 기술 스택이 5개 미만이면 추가
        return [...prevTechStack, stack];
      } else {
        // 5개 이상일 경우 선택할 수 없음
        setError("기술 스택은 최대 5개까지 선택할 수 있습니다.");
        return prevTechStack;
      }
    });
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력 값 검증
    if (!name || !email || !password || !phone || techStack.length === 0 || !position || !address || !nickname) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 기술 스택 5개 이하 선택 확인
    if (techStack.length > 5) {
      setError("기술 스택은 최대 5개까지 선택할 수 있습니다.");
      return;
    }

    setError(""); // 에러 메시지 초기화
    setIsSubmitting(true); // 제출 중 상태로 설정

    // 서버에 사용자 생성 요청
    Meteor.call('users.create', { name, email, password, phone, techStack, position, address, profilePicture, nickname }, (err, res) => {
      setIsSubmitting(false); // 제출 중 상태 해제
      if (err) {
        setError(err.reason); // 에러 메시지 표시
      } else {
        // 회원가입 성공 시 알림 팝업과 함께 메인 페이지로 이동
        alert("회원가입이 완료되었습니다.");
        navigate("/login/main"); // 메인 페이지로 이동
      }
    });
  };

  return (
    <div className="signup-form-container" style={{ width: "100%", maxWidth: "600px", margin: "auto", padding: "20px" }}>
      {error && <div className="error" style={{ color: "red", marginBottom: "20px" }}>{error}</div>} {/* 에러 메시지 표시 */}
      <form onSubmit={handleSubmit} className="signup-form">
        {/* 이미지 업로드 영역 */}
        <div className="image-upload-container" style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => document.getElementById('profile-picture').click()}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
            ) : (
              <span>이미지 업로드</span>
            )}
          </button>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* 이메일, 비밀번호, 이름, 전화번호, 주소 필드 */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", fontWeight: "bold" }}>이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block", fontWeight: "bold" }}>비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name" style={{ display: "block", fontWeight: "bold" }}>이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="nickname" style={{ display: "block", fontWeight: "bold" }}>닉네임</label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="phone" style={{ display: "block", fontWeight: "bold" }}>전화번호</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호를 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="address" style={{ display: "block", fontWeight: "bold" }}>주소</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          />
        </div>

        {/* 기술 스택 선택 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>기술 스택 (최대 5개)</label>
          <div className="tech-stack-list" style={{ display: "flex", flexWrap: "wrap" }}>
            {techStacks.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => handleTechStackClick(stack)}
                style={{
                  margin: "5px",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  backgroundColor: techStack.includes(stack) ? "#007bff" : "#f0f0f0",
                  color: techStack.includes(stack) ? "white" : "#333",
                  border: "1px solid #ddd",
                  cursor: "pointer"
                }}
              >
                {stack}
              </button>
            ))}
          </div>
        </div>

        {/* 포지션 선택 */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="position" style={{ fontWeight: "bold" }}>포지션</label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ddd" }}
          >
            <option value="">포지션을 선택하세요</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            borderRadius: "5px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: "none"
          }}
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}