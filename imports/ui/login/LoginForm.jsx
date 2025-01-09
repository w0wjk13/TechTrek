import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import Data from "./../Data";

const { citys,techStacks } = Data;


const positions = ["백엔드", "프론트엔드", "풀스택"];

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(""); // 이름 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [techStack, setTechStack] = useState([]); // 기술 스택 상태
  const [position, setPosition] = useState(""); // 포지션 상태
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGubun, setSelectedGubun] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // 프로필 사진 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 여부
  const [emailError, setEmailError] = useState(""); // 이메일 중복 오류 메시지
  const [nicknameError, setNicknameError] = useState(""); // 닉네임 중복 오류 메시지
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false); // 도시 드롭다운 열림 상태
  const [gubunDropdownOpen, setGubunDropdownOpen] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
// 이메일 중복 체크
useEffect(() => {
  if (email) {
    Meteor.call("users.checkEmailExists", email, (err, res) => {
      if (err) {
        setEmailError(err.reason); // 오류 메시지 설정
      } else {
        setEmailError(""); // 중복이 아니면 오류 메시지 초기화
      }
    });
  }
}, [email]);

// 닉네임 중복 체크
useEffect(() => {
  if (nickname) {
    Meteor.call("users.checkNicknameExists", nickname, (err, res) => {
      if (err) {
        setNicknameError(err.reason); // 오류 메시지 설정
      } else {
        setNicknameError(""); // 중복이 아니면 오류 메시지 초기화
      }
    });
  }
}, [nickname]);
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
    const address = `${selectedCity} ${selectedGubun}`;
    // 입력 값 검증
    if (!name || !email || !password || !phone || techStack.length === 0 || !position || !address || !nickname) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!selectedCity || !selectedGubun) {
      setError("지역 선택해주세요.");
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
    Meteor.call('users.create', { name, email, password, phone, techStack, position, address, profilePicture: finalProfilePicture, nickname }, (err, res) => {
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

  const finalProfilePicture = profilePicture || '/noimage.png';

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setSelectedGubun(''); // 도시 변경 시 구분 초기화
    setCityDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  const handleGubunChange = (gubun) => {
    setSelectedGubun(gubun);
    setGubunDropdownOpen(false); // 선택 후 드롭다운 닫기
  };
  return (
    <div className="loginform-signup-form-container" style={{ width: "100%", maxWidth: "600px", margin: "auto", padding: "20px" }}>
      
      <form onSubmit={handleSubmit} className="loginform-signup-form">
        {/* 이미지 업로드 영역 */}
        <div className="loginform-image-upload-container" style={{ textAlign: "center", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => document.getElementById('profile-picture').click()}
            className="loginform-image-upload-button"
          >
             <img src={finalProfilePicture} alt="Profile" className="loginform-profile-picture" />
 
          </button>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleImageChange}
            className="loginform-profile-picture-input"
          />
        </div>

        {/* 이메일, 비밀번호, 이름, 전화번호, 주소 필드 */}
        <div className="loginform-field" style={{ marginBottom: "15px" }}>
    
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className="loginform-input"
          />  {emailError && <div style={{ color: "red" }}>{emailError}</div>}
   </div>
        <div className="loginform-field" style={{ marginBottom: "15px" }}>
       
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="loginform-input"
          />
        </div>
        <div className="loginform-field" style={{ marginBottom: "15px" }}>
     
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="loginform-input"
          />
        </div>
        <div className="loginform-field" style={{ marginBottom: "15px" }}>
     
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="loginform-input"
          /> {nicknameError && <div style={{ color: "red" }}>{nicknameError}</div>}
        </div>
        <div className="loginform-field" style={{ marginBottom: "15px" }}>
      
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호를 입력하세요"
            className="loginform-input"
          />
        </div>
      
        <div className="loginform-location-select-container">
      {/* 도시 드롭다운 */}
      <div className="custom-select">
        <div
          className="selected-value"
          onClick={() => setCityDropdownOpen(!cityDropdownOpen)} // 클릭시 드롭다운 열기/닫기
        >
          {selectedCity || "지역를 선택하세요"}
        </div>
        {cityDropdownOpen && (
          <div className="options">
            {citys.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCityChange(city.name)}
                className="option"
              >
                {city.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 구분 드롭다운 */}
      <div className="custom-select">
        <div
          className="selected-value"
          onClick={() => setGubunDropdownOpen(!gubunDropdownOpen)} // 클릭시 드롭다운 열기/닫기
        >
          {selectedGubun || "시/군을 선택하세요"}
        </div>
        {gubunDropdownOpen && (
          <div className="options">
            {selectedCity &&
              citys
                .find((city) => city.name === selectedCity)
                ?.gubuns?.map((gubun, index) => (
                  <div
                    key={index}
                    onClick={() => handleGubunChange(gubun)}
                    className="option"
                  >
                    {gubun}
                  </div>
                ))}
          </div>
        )}
      </div>
    </div>

        {/* 기술 스택 선택 */}
        <div className="loginform-tech-stack" style={{ marginBottom: "10px" }}>
          <label className="loginform-label" style={{ fontWeight: "bold" }}>기술 스택 (최대 5개)</label>
          <div className="loginform-tech-stack-list" style={{ display: "flex", flexWrap: "wrap" }}>
            {techStacks.map((stack) => (
              <button
                key={stack}
                type="button"
                onClick={() => handleTechStackClick(stack)}
                className={`loginform-tech-stack-button ${techStack.includes(stack) ? "selected" : ""}`}
              >
                {stack}
              </button>
            ))}
          </div>
        </div>

        {/* 포지션 선택 */}
        <div className="loginform-position" >
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="loginform-position-input"
          >
            <option value="">포지션을 선택하세요</option>
            {positions.map((pos) => (
              <option key={pos} value={pos} >
                {pos}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="loginform-error" style={{ color: "red", marginBottom: "20px" }}>{error}</div>} {/* 에러 메시지 표시 */}
        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="loginform-submit-button"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}