import React, { useState } from "react";
//import '../../client/css/Home.css';

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

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [position, setPosition] = useState("");
  const [onlineOffline, setOnlineOffline] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const filterPositions = () => {
    if (techStack.length === 0) {
      return positions;
    }
    return positions;
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleTechStackChange = (e) => {
    const value = e.target.value;
    setTechStack((prevTechStack) => {
      if (prevTechStack.includes(value)) {
        return prevTechStack.filter((stack) => stack !== value);
      } else {
        return [...prevTechStack, value];
      }
    });
  };

  const handleOnlineOfflineChange = (e) => {
    setOnlineOffline(e.target.value);
  };

  const handleSearch = () => {
    const filteredResults = exampleResults.filter((result) => {
      const matchesRegion = selectedRegion ? result.region === selectedRegion : true;
      const matchesCity = selectedCity ? result.city === selectedCity : true;
      const matchesTechStack = techStack.length > 0 ? techStack.every(tech => result.techStack.includes(tech)) : true;
      const matchesPosition = position ? result.position === position : true;
      const matchesOnlineOffline = onlineOffline ? result.onlineOffline === onlineOffline : true;

      return (
        matchesRegion &&
        matchesCity &&
        matchesTechStack &&
        matchesPosition &&
        matchesOnlineOffline
      );
    });

    setSearchResults(filteredResults);
  };

  return (
    <div className="home-container">
      <h1 className="title">This is Home.</h1>

      {/* 지역, 시 선택 */}
      <div className="select-group">
        <label htmlFor="region">지역</label>
        <select id="region" value={selectedRegion} onChange={handleRegionChange}>
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
          <select id="city" value={selectedCity} onChange={handleCityChange}>
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
                onChange={handleTechStackChange}
                disabled={techStack.length >= 5 && !techStack.includes(stack)}
              />
              <label htmlFor={stack}>{stack}</label>
            </div>
          ))}
        </div>
        {techStack.length > 0 && (
          <div className="selected-tech">
            <strong>선택된 기술 스택: </strong>
            {techStack.join(", ")}
          </div>
        )}
      </div>

      {/* 포지션 선택 */}
      <div className="select-group">
        <label htmlFor="position">포지션</label>
        <select id="position" value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">선택하세요</option>
          {filterPositions().map((pos, index) => (
            <option key={index} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        {position && <div>선택된 포지션: {position}</div>}
      </div>

      {/* 온라인/오프라인 선택 */}
      <div className="radio-group">
        <label>진행 방식</label>
        <div>
          <input
            type="radio"
            id="online"
            name="onlineOffline"
            value="온라인"
            checked={onlineOffline === "온라인"}
            onChange={handleOnlineOfflineChange}
          />
          <label htmlFor="online">온라인</label>
        </div>
        <div>
          <input
            type="radio"
            id="offline"
            name="onlineOffline"
            value="오프라인"
            checked={onlineOffline === "오프라인"}
            onChange={handleOnlineOfflineChange}
          />
          <label htmlFor="offline">오프라인</label>
        </div>
      </div>

      <button onClick={handleSearch} className="search-button">검색하기</button>

      <div className="search-results">
        <h2>검색 결과</h2>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                {result.name} - {result.region} {result.city} - {result.position} - {result.onlineOffline} - 기술 스택: {result.techStack.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
