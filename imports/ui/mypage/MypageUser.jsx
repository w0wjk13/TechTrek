import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import Data from "./../Data";
import MypageNav from "./MypageNav"; // MypageNav 컴포넌트를 import
import { useTracker } from 'meteor/react-meteor-data';
const { citys,techStacks } = Data;
const positions = ["백엔드", "프론트엔드", "풀스택"];

export default function MypageUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState(""); 
  const [nickname, setNickname] = useState(""); 
  const [techStack, setTechStack] = useState([]); 
  const [position, setPosition] = useState(""); 
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGubun, setSelectedGubun] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); 
  const [error, setError] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false); // 도시 드롭다운 열림 상태
  const [gubunDropdownOpen, setGubunDropdownOpen] = useState(false);
  const navigate = useNavigate(); 

  const currentUser = useTracker(() => Meteor.user(), []);
  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const currentUser = Meteor.user();
    if (currentUser) {
      setEmail(currentUser.emails[0].address);  // 이메일
      setName(currentUser.profile?.name || "");
      setNickname(currentUser.profile?.nickname || "");
      setPhone(currentUser.profile?.phone || "");
      setTechStack(currentUser.profile?.techStack || []);
      setPosition(currentUser.profile?.position || "");
      const address = currentUser.profile?.address || { city: "", gubun: "" };
      setSelectedCity(address.city || "");
      setSelectedGubun(address.gubun || "");
      setProfilePicture(currentUser.profile?.profilePicture || null);
    }
}, [currentUser]);

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
        return prevTechStack.filter((item) => item !== stack);
      } else if (prevTechStack.length < 5) {
        return [...prevTechStack, stack];
      } else {
        setError("기술 스택은 최대 5개까지 선택할 수 있습니다.");
        return prevTechStack;
      }
    });
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setSelectedGubun(''); // 도시 변경 시 구분 초기화
    setCityDropdownOpen(false); // 선택 후 드롭다운 닫기
  };

  const handleGubunChange = (gubun) => {
    setSelectedGubun(gubun);
    setGubunDropdownOpen(false); // 선택 후 드롭다운 닫기
  };


  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 입력 값 검증
    if (!name || !email || !phone || techStack.length === 0 || !position || !selectedCity || !selectedGubun || !nickname) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
  
    setError(""); // 에러 메시지 초기화
    setIsSubmitting(true); // 제출 중 상태로 설정
 
     // 주소를 city와 gubun을 합쳐서 저장
     const addressObject = { city: selectedCity, gubun: selectedGubun };
  
    // 서버에 사용자 정보 수정 요청
    Meteor.call('users.update', { 
      name, 
      email, 
      password, 
      phone, 
      techStack, 
      position, 
      address: addressObject, // address를 문자열로 보내기
      profilePicture, 
      nickname 
    }, (err, res) => {
      setIsSubmitting(false); // 제출 중 상태 해제
      if (err) {
        setError(err.reason); // 에러 메시지 표시
      } else {
        // 수정 성공 시 알림 팝업과 함께 마이 페이지로 이동
        alert("회원정보가 수정되었습니다.");
        navigate("/mypage"); // 마이 페이지로 이동
      }
    });
  };
  
  return (
    <div>
      <div className="mypageuser-nav">
        <MypageNav />
      </div>
      <div className="mypageuser-form-container" style={{ width: "100%", maxWidth: "600px", margin: "auto", padding: "20px" }}>
        
        <form onSubmit={handleSubmit} className="mypageuser-form">
          {/* 이미지 업로드 영역 */}
          <div className="mypageuser-image-upload-container" style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => document.getElementById('profile-picture').click()}
              className="mypageuser-upload-button"
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="mypageuser-profile-image"  />
              ) : (
                <span className="mypageuser-upload-text">이미지 업로드</span>
              )}
            </button>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageChange}
              className="mypageuser-file-input"
            />
          </div>

          {/* 이메일, 비밀번호, 이름, 전화번호, 주소 필드 */}
          <div className="mypageuser-input-field" style={{ marginBottom: "15px" }}>
            <label htmlFor="email" style={{ display: "block", fontWeight: "bold" }}>이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="mypageuser-input"
            />
          </div>
          <div className="mypageuser-input-field" style={{ marginBottom: "15px" }}>
            <label htmlFor="password" style={{ display: "block", fontWeight: "bold" }}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="mypageuser-input"
            />
          </div>
          <div className="mypageuser-input-field" style={{ marginBottom: "15px" }}>
            <label htmlFor="name" style={{ display: "block", fontWeight: "bold" }}>이름</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="mypageuser-input"
            />
          </div>
          <div className="mypageuser-input-field" style={{ marginBottom: "15px" }}>
            <label htmlFor="nickname" style={{ display: "block", fontWeight: "bold" }}>닉네임</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="mypageuser-input"
            />
          </div>
          <div className="mypageuser-input-field" style={{ marginBottom: "15px" }}>
            <label htmlFor="phone" style={{ display: "block", fontWeight: "bold" }}>전화번호</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호를 입력하세요"
              className="mypageuser-input"
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
          <div className="mypageuser-tech-stack" style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>기술 스택 (최대 5개)</label>
            <div className="mypageuser-tech-stack-list" style={{ display: "flex", flexWrap: "wrap" }}>
              {techStacks.map((stack) => (
                <button
                  key={stack}
                  type="button"
                  onClick={() => handleTechStackClick(stack)}
                  className={`mypageuser-tech-stack-button ${techStack.includes(stack) ? 'selected' : ''}`}
                >
                  {stack}
                </button>
              ))}
            </div>
          </div>

          {/* 포지션 선택 */}
          <div className="mypageuser-position" style={{ marginBottom: "20px" }}>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mypageuser-position-select"
            >
              <option value="">포지션을 선택하세요</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="mypageuser-error" style={{ color: "red", marginBottom: "20px" }}>{error}</div>}
          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mypageuser-submit-button"
          >
            {isSubmitting ? "수정 중" : "회원정보 수정"}
          </button>
        </form>
      </div>
    </div>
  );
}
