import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import Data from "./../Data";


const { citys, techStacks } = Data;

const roles = ["백엔드", "프론트엔드", "풀스택"];



// 모집 마감일 형식 함수
const formatDDay = (studyClose) => {
  if (!studyClose) return "정보 없음";
  const today = new Date();
  const closeDay = new Date(studyClose);
  const timeDiff = closeDay.getTime() - today.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (dayDiff > 0) {
    return `D - ${dayDiff}`;
  } else if (dayDiff === 0) {
    return "D-day";
  } else {
    return "모집마감";
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
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalResults, setTotalResults] = useState(0); // Track total results
  const [sortOption, setSortOption] = useState("recent");
  const navigate = useNavigate();

  // 페이지 로딩 시 모든 스터디 데이터를 가져오기
  useEffect(() => {
    fetchSearchResults(currentPage, sortOption);
  }, [currentPage, sortOption]);

  const fetchSearchResults = (page, sortBy) => {
    const filters = {
      city: selectedCity,
      gubun: selectedGubun,
      techStack: techStack.length > 0 ? techStack : undefined,
      roles: rolesSelected.length > 0 ? rolesSelected : undefined,
      onOffline: onOffline.length > 0 ? onOffline : undefined,
      title: searchQuery.length > 0 ? searchQuery : undefined,
      status: "모집중",
    };

    Meteor.call("searchStudies", filters, page, 8, sortBy, (error, results) => {
      if (error) {
        console.error("검색 실패:", error);
      } else {
        setSearchResults(results.results);
        setTotalResults(results.total);
        setTotalPages(results.totalPages);
      }
    });
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchSearchResults(1, sortOption); // Fetch results for page 1
  };
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/study/detail/${id}`); // id가 포함된 상세 페이지로 이동
  };

  const formatAddress = (address) => {
    if (typeof address === 'string') {
      return address; 
    }
    if (address && address.city && address.gubun) {
      return `${address.city} ${address.gubun}`;
    }
    if (address && address.city) {
      return address.city;
    }
    if (address && address.gubun) {
      return address.gubun;
    }
    return "위치 정보 없음";
  };

  const formatOnOffline = (onOffline) => {
    if (Array.isArray(onOffline)) {
      return onOffline.join(", ");
    }
    return onOffline || "정보 없음";
  };

  return (
    <div className="home-container">
     <h1 className="home-search-title">
    스터디 검색
    </h1>

      <div className="home-location-select-container">
      <label htmlFor="city" className="home-location-label">지역</label>
    <div className="home-location-select-group">
      
      <select
        id="city"
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          setSelectedGubun(""); // 도시 변경 시 구분 초기화
        }}
        className="home-location-select"
      >
        <option value="">선택하세요</option>
        {citys.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>

    <div className="home-location-select-group">
    
      <select
        id="gubun"
        value={selectedGubun}
        onChange={(e) => setSelectedGubun(e.target.value)}
        className="home-location-select"
      >
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
  </div>

 <div className="home-tech-stack-checkbox-group">
  <label className="home-tech-stack-label">기술 스택</label>
  <div className="home-tech-stack-checkbox-list">
    {techStacks.map((stack, index) => (
      <div key={index} className="home-tech-stack-checkbox-item">
        <input
          type="checkbox"
          id={stack}
          value={stack}
          className="home-tech-stack-checkbox"
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
  {techStack.length >= 5 && <p className="home-tech-stack-warning">최대 5개까지 선택 가능합니다.</p>}
</div>

<div className="home-role-checkbox-group">
  <label>포지션</label>
  {roles.map((role, index) => (
    <div key={index} className="home-role-checkbox-item">
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

<div className="home-method-checkbox-group">
  <label>진행 방식</label>
  <div className="home-method-checkbox-item">
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
  <div className="home-method-checkbox-item">
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
  <div className="home-method-checkbox-item">
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

<div className="home-search-bar-container">
<div className="home-search-input-group">
  <input
    type="text"
    id="searchTitle"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="스터디 제목을 입력해보세요"
    className="home-search-input"
  />
</div>
<button onClick={handleSearch} className="home-search-action-button">검색하기</button>
</div>

      <div className="home-search-results">

      <div class="home-toggle-group">
  <label 
    class="home-toggle-label"
    onClick={() => handleSortChange('recent')}
    style={sortOption === 'recent' ? { fontWeight: 'bold', color: '#3b82f6' } : {}}
  >
    최근 등록순
  </label>
  <span class="home-separator">|</span>
  <label 
    class="home-toggle-label"
    onClick={() => handleSortChange('views')}
    style={sortOption === 'views' ? { fontWeight: 'bold', color: '#3b82f6' } : {}}
  >
    조회순
  </label>
  <span class="home-separator">|</span>
  <label 
    class="home-toggle-label"
    onClick={() => handleSortChange('deadline')}
    style={sortOption === 'deadline' ? { fontWeight: 'bold', color: '#3b82f6' } : {}}
  >
    마감일 순
  </label>
</div>

        {searchResults.length > 0 ? (
          <>
            <div className="home-results-display"> <ul className="home-search-results-list">
          {searchResults.map((result) => {
            const user = Meteor.users.findOne(result.userId);
            const username = user?.profile?.nickname || user?.username || "알 수 없음";
            return (
              <li key={result._id} className="home-search-result-item" onClick={() => handleViewDetail(result._id)}>
                <p className="home-result-due-date">{formatDDay(result.studyClose)}</p>
                <div className="home-result-title">{result.title}</div>
                <div className="home-search-item-overview">
                {Array.isArray(result.onOffline) ?
                  !result.onOffline.includes("온라인") && (
                    <div className="home-result-location">지역<span className="separator">|</span>{formatAddress(result.address)}</div>
                  ) : 
                  result.onOffline !== "온라인" && (
                    <div className="home-result-location">지역<span className="separator">|</span>{formatAddress(result.address)}</div>
                  )
                }

                <div className="home-result-mode">진행방식 <span className="separator">|</span> {formatOnOffline(result.onOffline)}</div>
   

                <div className="home-result-roles">포지션 <span className="separator">|</span>{result.roles}</div>
                </div> <div className="home-result-technology"><div className="home-result-tech-stack">
  {result.techStack.map((tech, index) => (
    <span key={index} className="tech-tag">{tech}</span>
  ))}
</div></div>
<div className="home-right-content">
<div className="home-result-author">
  {result.userId} 
  <span className="home-rating-tooltip">평점 {result.rating}</span>
  <span className="separator">|</span>
  <div className="home-result-views"> 👀{result.views}</div>
</div></div>

             
              </li>
            );
          })}
        </ul></div>
        
            {/* Pagination Controls */}
            <div className="home-pagination">
  {/* Previous Link */}
  <span
    onClick={() => handlePageChange(currentPage - 1)}
    className={currentPage === 1 ? "disabled" : "home-pagination-link"}
  >
    이전
  </span>

  {/* Page Numbers */}
  {[...Array(totalPages)].map((_, index) => (
    <span
      key={index + 1}
      onClick={() => handlePageChange(index + 1)}
      className={index + 1 === currentPage ? "active pagination-link" : "home-pagination-link"}
    >
      {index + 1}
    </span>
  ))}

  {/* Next Link */}
  <span
    onClick={() => handlePageChange(currentPage + 1)}
    className={currentPage === totalPages ? "disabled" : "home-pagination-link"}
  >
    다음
  </span>
</div>

          </>
        ) : (
          <div class="home-no-results">
          <span class="home-icon">⚠️</span>
          <span>검색 결과가 없습니다.</span>
        </div>
        )}
      </div>
    </div>
  );
}