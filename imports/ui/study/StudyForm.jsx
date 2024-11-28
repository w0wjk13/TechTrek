import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import Data from "../Data";

const { citys, techStacks } = Data;

const StudyForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGubun, setSelectedGubun] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [studyCount, setStudyCount] = useState(2);
  const [studyClose, setStudyClose] = useState('');
  const [roles, setRoles] = useState([]);
  const [onOffline, setOnOffline] = useState('');
  const [score, setScore] = useState({
    manner: '',
    mentoring: '',
    passion: '',
    communication: '',
    time: ''
  });

  const navigate = useNavigate();
  const isInitialized = useRef(false);
  // 사용자 주소 정보 가져오기
  const currentUser = Meteor.user(); // Get logged-in user info

  // Check if address is a string before calling split
  const userCity = typeof currentUser?.profile?.address === 'string'
    ? currentUser.profile.address.split(" ")[0]
    : ''; // Extract city if address is a string, otherwise use an empty string

  const userGubun = typeof currentUser?.profile?.address === 'string'
    ? currentUser.profile.address.split(" ")[1]
    : ''; // Extract gubun if address is a string, otherwise use an empty string

  // Use default values if techStack, roles, or score are undefined
  const userTechStack = Array.isArray(currentUser?.profile?.techStack)
    ? currentUser.profile.techStack
    : []; // Use an empty array if techStack is not an array

  const userRoles = Array.isArray(currentUser?.profile?.roles)
    ? currentUser.profile.roles
    : []; // Use an empty array if roles is not an array

  const userScores = currentUser?.profile?.score && typeof currentUser.profile.score === 'object'
    ? currentUser.profile.score
    : {}; // Use an empty object if score is not an object


  useEffect(() => {
    if (!isInitialized.current) {
      // Set the state with user data only if it's not initialized yet
      if (userCity && !selectedCity) {
        setSelectedCity(userCity); // 상태가 비어 있을 때만 업데이트
      }
      if (userGubun && !selectedGubun) {
        setSelectedGubun(userGubun); // 상태가 비어 있을 때만 업데이트
      }
      if (userTechStack.length > 0) {
        setTechStack(userTechStack); // Set user's pre-selected tech stack
      }
      if (userRoles.length > 0) {
        setRoles(userRoles); // 사용자 역할 정보로 초기화
      }
      if (userScores) {
        setScore({
          manner: userScores.manner || 0,
          mentoring: userScores.mentoring || 0,
          passion: userScores.passion || 0,
          communication: userScores.communication || 0,
          time: userScores.time || 0
        });
      }

      const today = new Date();
      today.setDate(today.getDate() + 3); // Set to 3 days later
      setStudyClose(today.toISOString().split('T')[0]);

      isInitialized.current = true; // Mark as initialized
    }
  }, [userCity, userGubun, userTechStack, userRoles, userScores, selectedCity, selectedGubun, techStack]);



  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3); // 현재 날짜에 3일을 더함
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1); // 1개월 이후 날짜까지 선택 가능
    return today.toISOString().split('T')[0];
  };

  const handleTechStackClick = (tech) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((item) => item !== tech)); // 이미 선택된 기술이면 제거
    } else if (techStack.length < 5) {
      setTechStack([...techStack, tech]); // 선택되지 않은 기술이면 추가 (최대 5개까지)
    } else {
      alert("최대 5개의 기술 스택만 선택할 수 있습니다.");
    }
  };

  const handleRolesChange = (e) => {
    const value = e.target.value;
    setRoles([value]); // 라디오 버튼은 하나의 값만 선택 가능
  };

  const scoreCategories = [
    { key: 'manner', label: '매너 점수' },
    { key: 'mentoring', label: '멘토링 점수' },
    { key: 'passion', label: '열정 점수' },
    { key: 'communication', label: '소통 점수' },
    { key: 'time', label: '시간 관리 점수' },
  ];

  const handleScoreChange = (key, value) => {
    const numValue = parseInt(value, 10);

    if (numValue >= 0 && numValue <= 5) {
      setScore(prevScore => ({ ...prevScore, [key]: numValue }));
    } else {
      alert("점수는 0부터 5 사이의 값만 입력할 수 있습니다.");
    }
  };

  const handleSubmit = () => {
    // Check if all required fields are filled
    if (!title || !content || !studyClose || !roles.length || !onOffline || !techStack.length) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // Ensure only one score is filled
    const filledScores = Object.values(score).filter(s => s !== '');
    if (filledScores.length !== 5) {
      alert("요구하는 점수는 모두 입력해주세요.");
      return;
    }

    const currentUser = Meteor.user();
  const userId = currentUser?.profile?.nickname;

  if (!userId) {
    alert("사용자 정보가 올바르지 않습니다.");
    return;
  }

    // Prepare the data to submit
    const studyData = {
      userId,
      title,
      content,
      address: { city: selectedCity, gubun: selectedGubun },
      techStack,
      studyCount,
      studyClose: new Date(studyClose),
      roles,
      onOffline,
      score,
    };

    // Server request to create a study
    Meteor.call('study.create', studyData, (error) => {
      if (error) {
        alert(`Error: ${error.reason}`);
      } else {
        alert('스터디가 성공적으로 생성되었습니다!');
        navigate('/');  // 메인 페이지로 이동
      }
    });
  };

  return (
    <div className="study-create-form">
      <h1>스터디 생성</h1>

      {/* Fields for Study Creation */}
      <div>
        <label>모집 마감일</label>
        <input
          type="date"
          value={studyClose}
          onChange={(e) => setStudyClose(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
        />
      </div>

      <div>
        <label>모집 인원</label>
        <select
          value={studyCount}
          onChange={(e) => setStudyCount(e.target.value)}
        >
          {[...Array(9)].map((_, index) => (
            <option key={index + 2} value={index + 2}>{index + 2}</option>
          ))}
        </select>
      </div>

      <div>
        <label>지역</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedGubun(''); // Reset gubun when city changes
          }}
        >
          <option value="">선택하세요</option>
          {citys.map((city, index) => (
            <option key={index} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>구</label>
        <select
          value={selectedGubun}
          onChange={(e) => setSelectedGubun(e.target.value)}
        >
          <option value="">선택하세요</option>
          {citys
            .find((city) => city.name === selectedCity)
            ?.gubuns?.map((gubun, index) => (
              <option key={index} value={gubun}>{gubun}</option>
            ))}
        </select>
      </div>

      {/* Tech Stack Selection */}
      <div>
        <label>기술 스택 (최대 5개 선택)</label>
        <div className="tech-stack-buttons">
          {techStacks.map((tech) => (
            <button
              type="button"
              key={tech}
              onClick={() => handleTechStackClick(tech)}
              className={techStack.includes(tech) ? 'selected' : ''}
              disabled={techStack.length >= 5 && !techStack.includes(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      {/* Display Selected Tech Stacks */}
      <div>
        <label>선택된 기술 스택</label>
        {techStack.length > 0 ? (
          <ul>
            {techStack.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        ) : (
          <p>선택된 기술 스택이 없습니다.</p>
        )}
      </div>
      {/* On/Offline Selection */}
      <div>
        <label>진행 방식</label>
        <div className="on-offline-selection">
          <label>
            <input
              type="radio"
              name="onOffline"
              value="온라인"
              checked={onOffline === "온라인"}
              onChange={(e) => setOnOffline(e.target.value)}
            />
            온라인
          </label>
          <label>
            <input
              type="radio"
              name="onOffline"
              value="오프라인"
              checked={onOffline === "오프라인"}
              onChange={(e) => setOnOffline(e.target.value)}
            />
            오프라인
          </label>
          <label>
            <input
              type="radio"
              name="onOffline"
              value="온/오프라인"
              checked={onOffline === "온/오프라인"}
              onChange={(e) => setOnOffline(e.target.value)}
            />
            온/오프라인
          </label>
        </div>
      </div>

      {/* Roles */}
      <div>
        <label>요구하는 역할</label>
        <div className="role-radio-buttons">
          <label>
            <input
              type="radio"
              name="role"
              value="백엔드"
              checked={roles.includes("백엔드")}
              onChange={handleRolesChange}
            />
            백엔드
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="프론트엔드"
              checked={roles.includes("프론트엔드")}
              onChange={handleRolesChange}
            />
            프론트엔드
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="풀스택"
              checked={roles.includes("풀스택")}
              onChange={handleRolesChange}
            />
            풀스택
          </label>
        </div>
      </div>

      {/* Scores */}
      <div>
        <label>요구하는 점수</label>
        {scoreCategories.map((category) => (
          <div key={category.key}>
            <label>{category.label}</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((scoreValue) => (
                <span
                  key={scoreValue}
                  onClick={() => handleScoreChange(category.key, scoreValue)}
                  style={{
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: score[category.key] >= scoreValue ? '#FFD700' : '#D3D3D3', // Gold for selected, gray for unselected
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>



      {/* Title and Content */}
      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="스터디 제목"
        />
      </div>

      <div>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="스터디 내용"
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit}>스터디 생성</button>
    </div>
  );
};

export default StudyForm;
