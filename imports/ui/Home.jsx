import React, { useState } from "react";

// 기술 스택 및 포지션 목록
const techStacks = [
  "Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle",
  "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript",
  "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"
];

const positions = ["백엔드", "프론트엔드", "풀스택"];

// 지역, 시, 구 데이터 구조 변경 (동은 제외)
const regions = [
  {
    name: "서울",
    cities: ["강남구", "송파구", "강북구", "중구"]
  },
  {
    name: "부산",
    cities: ["해운대구", "수영구", "동래구", "사상구"]
  }
];



export default function Home() {
  // 상태 관리
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [position, setPosition] = useState("");
  const [onlineOffline, setOnlineOffline] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 기술 스택에 맞는 포지션 필터링
  const filterPositions = () => {
    // 선택된 기술 스택에 해당하는 포지션을 필터링
    if (techStack.length === 0) {
      return positions;
    }

    // 예시로 "Java", "React"를 선택하면 "프론트엔드", "백엔드" 등 기술에 맞는 포지션만 출력될 수 있도록 해야 합니다.
    // 예시 데이터에서는 단순히 모든 포지션을 제공하도록 설정.
    return positions;
  };

  // 지역, 시 선택 핸들러
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedCity(""); // 시 초기화
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // 기술 스택 선택 핸들러
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

  // 온라인/오프라인 선택 핸들러
  const handleOnlineOfflineChange = (e) => {
    setOnlineOffline(e.target.value);
  };

  // 검색 버튼 클릭 시 실행되는 함수
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
    <div>
      <h1>This is Home.</h1>

      {/* 지역, 시 선택 */}
      <div>
        <label>지역</label>
        <select value={selectedRegion} onChange={handleRegionChange}>
          <option value="">선택하세요</option>
          {regions.map((region, index) => (
            <option key={index} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div>
          <label>구</label>
          <select value={selectedCity} onChange={handleCityChange}>
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
      <div>
        <label>기술 스택 (최대 5개)</label>
        <div>
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
        <div>
          {techStack.length > 0 && (
            <div>
              <strong>선택된 기술 스택: </strong>
              {techStack.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* 포지션 선택 (기술 스택에 맞는 포지션 자동 필터링) */}
      <div>
        <label>포지션</label>
        <select value={position} onChange={(e) => setPosition(e.target.value)}>
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
      <div>
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

      {/* 검색 버튼 */}
      <button onClick={handleSearch}>검색하기</button>

      {/* 검색 결과 출력 */}
      <div>
        <h2>검색 결과</h2>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map(result => (
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
