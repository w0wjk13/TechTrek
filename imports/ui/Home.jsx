import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

// 기술 스택 및 포지션 목록
const techStacks = [
  "Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle",
  "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript",
  "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"
];

const positions = ["백엔드", "프론트엔드", "풀스택"];

const regions = [
  {
    name: "서울",
    cities: [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
    ]
  },
  {
    name: "부산",
    cities: ["해운대구", "수영구", "동래구", "사상구"]
  }
];

// 모집 마감일 형식 함수
const formatDDay = (studyClose) => {
  const today = new Date();
  const closeDay = new Date(studyClose);

  const timeDiff = closeDay.getTime() - today.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (dayDiff > 0) {
    return `D-${dayDiff}일`;
  } else if (dayDiff === 0) {
    return "오늘 마감";
  } else {
    return "마감";
  }
};

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [position, setPosition] = useState("");
  const [onlineOffline, setOnlineOffline] = useState(""); // 온라인/오프라인 상태 추가
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate(); // navigate 훅을 사용하여 페이지 이동

  // 페이지 로딩 시 모든 스터디 데이터를 가져오기
  useEffect(() => {
    Meteor.call("getAllStudies", (error, results) => {
      if (error) {
        console.error("모든 데이터 로드 실패:", error);
      } else {
        setSearchResults(results);
      }
    });
  }, []); // 빈 배열을 넣어서 컴포넌트가 마운트 될 때 한 번만 호출되도록 함

  const handleSearch = () => {
    // 검색 조건 객체 생성
    const filters = {
      region: selectedRegion,          // 지역
      city: selectedCity,             // 구
      techStack: techStack,           // 기술 스택
      position: position,             // 포지션
      onlineOffline: onlineOffline    // 진행 방식
    };

    // 서버에서 검색 결과 가져오기
    Meteor.call("searchStudies", filters, (error, results) => {
      if (error) {
        console.error("검색 실패:", error);
      } else {
        setSearchResults(results);
      }
    });
  };

  const handleViewDetail = (studyId) => {
    // 해당 studyId로 상세 페이지로 이동
    navigate(`/study/${studyId}`);
  };

  return (
    <div className="home-container">
      <h1 className="title">스터디 검색</h1>

      {/* 지역, 시 선택 */}
      <div className="select-group">
        <label htmlFor="region">지역</label>
        <select id="region" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option value="">선택하세요</option>
          {regions.map((region, index) => (
            <option key={index} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div className="select-group">
          <label htmlFor="city">구</label>
          <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">선택하세요</option>
            {regions
              .find((region) => region.name === selectedRegion)
              .cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* 기술 스택 선택 */}
      <div className="checkbox-group">
        <label>기술 스택 (최대 5개)</label>
        <div className="checkbox-list">
          {techStacks.map((stack, index) => (
            <div key={index} className="checkbox-item">
              <input
                type="checkbox"
                id={stack}
                value={stack}
                checked={techStack.includes(stack)}
                onChange={(e) => {
                  const value = e.target.value;
                  setTechStack((prevTechStack) => {
                    if (prevTechStack.includes(value)) {
                      return prevTechStack.filter((stack) => stack !== value);
                    } else if (prevTechStack.length < 5) {
                      return [...prevTechStack, value];
                    }
                    return prevTechStack;
                  });
                }}
              />
              <label htmlFor={stack}>{stack}</label>
            </div>
          ))}
        </div>
        {techStack.length >= 5 && <p>최대 5개까지 선택 가능합니다.</p>}
      </div>

      {/* 포지션 선택 */}
      <div className="select-group">
        <label htmlFor="position">포지션</label>
        <select id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">선택하세요</option>
          {positions.map((pos, index) => (
            <option key={index} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      {/* 온라인/오프라인 선택 */}
      <div className="checkbox-group">
        <label>진행 방식</label>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="online"
            value="온라인"
            checked={onlineOffline.includes("온라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnlineOffline((prev) =>
                prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
              );
            }}
          />
          <label htmlFor="online">온라인</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="offline"
            value="오프라인"
            checked={onlineOffline.includes("오프라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnlineOffline((prev) =>
                prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
              );
            }}
          />
          <label htmlFor="offline">오프라인</label>
        </div>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="onOffline"
            value="온/오프라인"
            checked={onlineOffline.includes("온/오프라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnlineOffline((prev) =>
                prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
              );
            }}
          />
          <label htmlFor="onOffline">온/오프라인</label>
        </div>
      </div>

      <button onClick={handleSearch} className="search-button">검색하기</button>

      <div className="search-results">
        <h2>검색 결과</h2>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => {
              const user = Meteor.users.findOne(result.userId);  // 작성자 정보 가져오기
              const username = user?.profile?.nickname || user?.username || "알 수 없음";  // 닉네임이나 기본 유저명
              return (
                <li key={result._id}>
                  <p>마감일: {formatDDay(result.studyClose)}</p>
                  <span>지역:{result.location}</span><br />
                  <span>진행방식:{result.onOffline}</span><br />
                  <strong>{result.title}</strong><br /><br />
                  <span>포지션: {result.roles}</span><br />
                  <span>기술 스택: {result.techStack.join(", ")}</span><br />
                  <span>작성자: {username}</span><br />
                  <span>조회수:{result.views}</span>
                  <button onClick={() => handleViewDetail(result._id)}>상세 보기</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
