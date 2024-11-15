import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
//import '../../client/css/LoginForm.css';

// 기술 스택 및 포지션 목록
const techStacks = [
  "Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle",
  "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript",
  "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"
];

const positions = ["백엔드", "프론트엔드", "풀스택"];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(""); // 이름 상태
  const [techStack, setTechStack] = useState([]); // 기술 스택 상태
  const [position, setPosition] = useState(""); // 포지션 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [profilePicture, setProfilePicture] = useState(null); // 프로필 사진 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  // 이메일 중복 체크
  const checkDuplicateEmail = (email) => {
    return !!Meteor.users.findOne({ email });
  };

  // 전화번호 중복 체크
  const checkDuplicatePhone = (phone) => {
    return !!Meteor.users.findOne({ "profile.phone": phone });
  };

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

  // 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력 값 검증
    if (!name || !email || !password || !phone || techStack.length === 0 || !position || !address) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 기술 스택 5개 이하 선택 확인
    if (techStack.length > 5) {
      setError("기술 스택은 최대 5개까지 선택할 수 있습니다.");
      return;
    }

    // 이메일 중복 체크
    if (checkDuplicateEmail(email)) {
      setError("이미 등록된 이메일입니다.");
      return;
    }

    // 전화번호 중복 체크
    if (checkDuplicatePhone(phone)) {
      setError("이미 등록된 전화번호입니다.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // 사용자 생성
    Accounts.createUser({
      username: email, // 이메일을 username으로 사용
      email,
      password,
      profile: {
        name,
        phone,
        techStack, // 기술 스택 그대로 저장
        position,
        profilePicture, // 선택된 프로필 사진 저장
        address, // 사용자가 입력한 주소
        averageScore: 3 // 초기 평균 점수 설정
      },
      createdAt: new Date()
    }, (err) => {
      setIsSubmitting(false);
      if (err) {
        setError("회원가입 중 오류가 발생했습니다.");
      } else {
        // 회원가입 성공 시 로그인 페이지로 리디렉션
        navigate("/login");
      }
    });
  };

  // 기술 스택 선택/취소 핸들러
  const handleTechStackChange = (e) => {
    const value = e.target.value;

    // 체크박스를 클릭했을 때, 기술 스택 배열에 추가하거나 제거
    setTechStack((prevTechStack) => {
      if (prevTechStack.includes(value)) {
        return prevTechStack.filter((stack) => stack !== value); // 이미 선택된 항목은 제거
      } else {
        return [...prevTechStack, value]; // 새 항목은 추가
      }
    });
  };

  return (
    <div className="signup-form-container">
      {error && <div className="error">{error}</div>} {/* 에러 메시지 표시 */}
      <form onSubmit={handleSubmit} className="signup-form">

        {/* 이미지 업로드 영역 */}
        <div className="image-upload-container">
          <label htmlFor="profile-picture" className="image-upload-label">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture-preview" />
            ) : (
              <span>이미지 업로드</span>
            )}
          </label>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        {/* 이메일, 비밀번호, 이름, 전화번호, 주소 필드 */}
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="phone">전화번호</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호를 입력하세요"
          />
        </div>
        <div>
          <label htmlFor="address">주소</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
          />
        </div>

        {/* 기술 스택 선택 */}
        <div>
          <label>기술 스택 (최대 5개)</label>
          <div className="checkbox-group">
            {techStacks.map((stack, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={stack}
                  value={stack}
                  checked={techStack.includes(stack)}
                  onChange={handleTechStackChange}
                  disabled={techStack.length >= 5 && !techStack.includes(stack)} // 5개 이상 선택되었으면 비활성화
                />
                <label htmlFor={stack}>{stack}</label>
              </div>
            ))}
          </div>

          <div className="selected-tech-stacks">
            {techStack.map((stack, index) => (
              <span key={index}>
                {stack}
                <button
                  type="button"
                  onClick={() => handleTechStackChange({ target: { value: stack } })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 포지션 선택 */}
        <div>
          <label htmlFor="position">포지션</label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((pos, index) => (
              <option key={index} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "회원가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}