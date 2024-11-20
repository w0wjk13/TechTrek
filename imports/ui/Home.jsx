import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";

// 기술 스택 목록
const techStacks = [
  "Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle",
  "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript",
  "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"
];

const roles = ["백엔드", "프론트엔드", "풀스택"];

const citys = [
  {
    name: "서울",
    gubuns: [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
    ]
  },
  {
    name: "부산",
    gubuns: ["해운대구", "수영구", "동래구", "사상구"]
  }
];

// 모집 마감일 형식 함수
const formatDDay = (studyClose) => {
  if (!studyClose) return "정보 없음"; // null 또는 undefined 처리
  const today = new Date();
  const closeDay = new Date(studyClose);
  const timeDiff = closeDay.getTime() - today.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (dayDiff > 0) {
    return `D - ${dayDiff}`;
  } else if (dayDiff === 0) {
    return "오늘 마감";
  } else {
    return "마감";
  }
};

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGubun, setSelectedGubun] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [rolesSelected, setRolesSelected] = useState([]);
  const [onOffline, setOnOffline] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

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
    const filters = {
      city: selectedCity,
      gubun: selectedGubun,
      techStack: techStack.length > 0 ? techStack : undefined,
      roles: rolesSelected.length > 0 ? rolesSelected : undefined,
      onOffline: onOffline.length > 0 ? onOffline : undefined,
      title: searchQuery.length > 1 ? searchQuery : undefined
    };

    Meteor.call("searchStudies", filters, (error, results) => {
      if (error) {
        console.error("검색 실패:", error);
      } else {
        setSearchResults(results);
      }
    });
  };

  const handleViewDetail = (studyId) => {
    navigate(`/study/${studyId}`);
  };

  const formatLocation = (location) => {
    if (location && location.city && location.gubun) {
      return `${location.city} - ${location.gubun}`;
    }
    return location ? location.city || location.gubun : "위치 정보 없음";
  };

  const formatOnOffline = (onOffline) => {
    if (Array.isArray(onOffline)) {
      return onOffline.join(", ");
    }
    return onOffline || "정보 없음";
  };

  return (
    <div className="home-container">
      <h1 className="title">스터디 검색</h1>

      <div className="select-group">
        <label htmlFor="city">지역</label>
        <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          <option value="">선택하세요</option>
          {citys.map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="select-group">
        <label htmlFor="gubun">구</label>
        <select id="gubun" value={selectedGubun} onChange={(e) => setSelectedGubun(e.target.value)}>
          <option value="">선택하세요</option>
          {selectedCity &&
            citys
              .find((city) => city.name === selectedCity)
              ?.gubuns?.map((gubun, index) => (
                <option key={index} value={gubun}>
                  {gubun}
                </option>
              ))}
        </select>
      </div>

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

      <div className="checkbox-group">
        <label>역할</label>
        {roles.map((role, index) => (
          <div key={index} className="checkbox-item">
            <input
              type="checkbox"
              id={role}
              value={role}
              checked={rolesSelected.includes(role)}
              onChange={(e) => {
                const value = e.target.value;
                setRolesSelected((prev) =>
                  prev.includes(value) ? prev.filter((role) => role !== value) : [...prev, value]
                );
              }}
            />
            <label htmlFor={role}>{role}</label>
          </div>
        ))}
      </div>

      <div className="checkbox-group">
        <label>진행 방식</label>
        <div className="checkbox-item">
          <input
            type="checkbox"
            id="online"
            value="온라인"
            checked={onOffline.includes("온라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnOffline((prev) =>
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
            checked={onOffline.includes("오프라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnOffline((prev) =>
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
            checked={onOffline.includes("온/오프라인")}
            onChange={(e) => {
              const value = e.target.value;
              setOnOffline((prev) =>
                prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
              );
            }}
          />
          <label htmlFor="onOffline">온/오프라인</label>
        </div>
      </div>

      <div className="search-group">
        <label htmlFor="titleSearch">제목 검색</label>
        <input
          type="text"
          id="titleSearch"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="제목에 포함된 두 글자 이상 입력"
        />
      </div>
      <button onClick={handleSearch} className="search-button">검색하기</button>

      <div className="search-results">
        <h2>검색 결과</h2>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => {
              const user = Meteor.users.findOne(result.userId);
              const username = user?.profile?.nickname || user?.username || "알 수 없음";
              return (
                <li key={result._id}>
                  <p>마감일: {formatDDay(result.studyClose)}</p>
                  <span>지역: {formatLocation(result.location)}</span><br />
                  <span>진행방식: {formatOnOffline(result.onOffline)}</span><br />
                  <strong>{result.title}</strong><br /><br />
                  <span>역할: {result.roles}</span><br />
                  <span>기술 스택: {result.techStack && Array.isArray(result.techStack) ? result.techStack.join(", ") : "기술 스택 없음"}</span><br />
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
