// /imports/ui/Home.js
import React, { useState } from "react";

// 임의의 더미 사용자 데이터
const dummyData = Array.from({ length: 100 }, (_, i) => ({
  name: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  address: {
    city: ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "제주", "경기"].sort(() => Math.random() - 0.5)[0], // 랜덤으로 도시 선택
    district: ["강남구", "강동구", "강서구", "해운대구", "수성구", "서구", "유성구", "중구", "제주시"][Math.floor(Math.random() * 9)] // 구는 랜덤으로
  },
  techStack: ["Java", "NodeJS", "React", "Python", "AWS", "Docker"].sort(() => 0.5 - Math.random()).slice(0, 2),
  position: ["백엔드", "프론트엔드", "풀스택"][Math.floor(Math.random() * 3)],
  mode: ["온라인", "오프라인"][Math.floor(Math.random() * 2)]
}));

const techStacks = ["Java", "NodeJS", "Kotlin", "Mysql", "MongoDB", "Python", "Oracle", "AWS", "Spring", "Azure", "NextJS", "Kubernetes", "Javascript", "Flutter", "Docker", "Typescript", "Swift", "Django", "React", "ReactNative"];
const positions = ["백엔드", "프론트엔드", "풀스택"];
const regions = [
  { city: "서울", districts: ["강남구", "강동구", "강서구", "강북구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"] },
  { city: "경기", districts: ["고양시", "성남시", "수원시", "용인시", "화성시", "평택시", "안산시", "광명시", "시흥시", "안양시", "부천시", "파주시", "여주군", "이천시", "김포시"] },
  { city: "부산", districts: ["해운대구", "사하구", "동래구"] },
  { city: "대구", districts: ["달서구", "수성구"] },
  { city: "인천", districts: ["연수구", "남동구"] },
  { city: "광주", districts: ["광산구", "서구"] },
  { city: "대전", districts: ["서구", "유성구"] },
  { city: "울산", districts: ["중구", "남구"] },
  { city: "제주", districts: ["제주시", "서귀포시"] }
];
const modes = ["온라인", "오프라인"];

const Home = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    const filters = {
      city: selectedCity,
      district: selectedDistrict,
      techStack: selectedTechStack,
      position: selectedPosition,
      mode: selectedMode
    };
    const results = dummyData.filter(user => {
      return (
        (!filters.city || user.address.city === filters.city) &&
        (!filters.district || user.address.district === filters.district) &&
        (!filters.techStack.length || filters.techStack.every(tech => user.techStack.includes(tech))) &&
        (!filters.position || user.position === filters.position) &&
        (!filters.mode || user.mode === filters.mode)
      );
    });
    setSearchResults(results);
  };

  return (
    <div>
      <h2>사용자 검색</h2>
      <div>
        <label>도시 선택:</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict(""); // 도시 변경 시 구 초기화
          }}
        >
          <option value="">도시 선택</option>
          {regions.map((region, index) => (
            <option key={index} value={region.city}>{region.city}</option>
          ))}
        </select>

        {selectedCity && (
          <div>
            <label>구 선택:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">구 선택</option>
              {regions.find(region => region.city === selectedCity).districts.map((district, index) => (
                <option key={index} value={district}>{district}</option>
              ))}
            </select>
          </div>
        )}

        <label>기술 스택 선택:</label>
        <select
          multiple
          value={selectedTechStack}
          onChange={(e) => setSelectedTechStack([...e.target.selectedOptions].map(opt => opt.value))}
        >
          {techStacks.map((tech, index) => (
            <option key={index} value={tech}>{tech}</option>
          ))}
        </select>

        <label>직무 선택:</label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">직무 선택</option>
          {positions.map((position, index) => (
            <option key={index} value={position}>{position}</option>
          ))}
        </select>

        <label>진행 방식 선택:</label>
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
        >
          <option value="">진행 방식 선택</option>
          {modes.map((mode, index) => (
            <option key={index} value={mode}>{mode}</option>
          ))}
        </select>

        <button onClick={handleSearch}>검색</button>
      </div>

      <h3>검색 결과:</h3>
      <ul>
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <li key={index}>
              이름: {user.name}, 이메일: {user.email}, 주소: {user.address.city} {user.address.district}, 기술 스택: {user.techStack.join(", ")}, 직무: {user.position}, 진행 방식: {user.mode}
            </li>
          ))
        ) : (
          <li>검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
