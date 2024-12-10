import React, { useState, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import Data from "../Data";
import { useTracker } from 'meteor/react-meteor-data';  // useTracker import 추가

const { citys, techStacks } = Data;

const StudyForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGubun, setSelectedGubun] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [studyCount, setStudyCount] = useState(2);
  const [studyClose, setStudyClose] = useState('');
  const [roles, setRoles] = useState(['백엔드']);
  const [onOffline, setOnOffline] = useState('온라인');
  const [rating, setRating] = useState(null);

  const navigate = useNavigate();
  const isInitialized = useRef(false);

  const currentUser = useTracker(() => Meteor.user());
  const userCity = currentUser?.profile?.address?.city || '';  // 도시 정보
  const userGubun = currentUser?.profile?.address?.gubun || '';  // 구 정보

  const userTechStack = Array.isArray(currentUser?.profile?.techStack)
    ? currentUser.profile.techStack
    : [];
  const userRoles = Array.isArray(currentUser?.profile?.roles)
    ? currentUser.profile.roles
    : [];
  const userRating = currentUser?.profile?.rating || 0;

  useEffect(() => {
    if (currentUser && !isInitialized.current) {
      if (userCity && !selectedCity) {
        setSelectedCity(userCity);
      }
      if (userGubun && !selectedGubun) {
        setSelectedGubun(userGubun);
      }
      if (userTechStack.length > 0) {
        setTechStack(userTechStack);
      }

      const today = new Date();
      today.setDate(today.getDate() + 3);
      setStudyClose(today.toISOString().split('T')[0]);

      setRating(userRating); 

      isInitialized.current = true;
    }
  }, [currentUser,userCity, userGubun, userTechStack, userRating]);

  // useTracker 사용하여 실시간으로 지역과 구 데이터를 추적
  const { cityList } = useTracker(() => {
    return { cityList: citys };  // citys 데이터를 실시간으로 추적
  });

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().split('T')[0];
  };

  const handleTechStackClick = (tech) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((item) => item !== tech));
    } else if (techStack.length < 5) {
      setTechStack([...techStack, tech]);
    } else {
      alert("최대 5개의 기술 스택만 선택할 수 있습니다.");
    }
  };

  const handleRolesChange = (e) => {
    const value = e.target.value;
    setRoles([value]);
  };

  const handleStarClick = (value) => {
    // 사용자 평점보다 높은 값을 선택하려는 경우
    if (parseInt(value) > userRating) {
      alert(`내 평점보다 높은 평점을 설정할 수 없습니다.`);
    } else {
      if (rating === value) {
        // 이미 선택한 별을 다시 클릭하면 평점을 0으로 설정
        setRating(0);
      } else {
        setRating(value);  // 선택된 평점 값 설정
      }
    }
  };
  

  const handleSubmit = () => {
    if (!title || !content || !studyClose || !roles.length || !onOffline || !techStack.length) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (onOffline !== "온라인" && (!selectedCity || !selectedGubun)) {
     
      return;
    }

    const currentUser = Meteor.user();
    const userId = currentUser?.profile?.nickname;
    if (!userId) {
      alert("사용자 정보가 올바르지 않습니다.");
      return;
    }

    const studyData = {
      userId,
      title,
      content,
      address: onOffline === "온라인" ? {} : { city: selectedCity, gubun: selectedGubun },
      techStack,
      studyCount,
      studyClose: new Date(studyClose),
      roles: roles.length > 0 ? roles : ['백엔드'],
      onOffline: onOffline || '온라인',
      rating,
    };

    Meteor.call('study.create', studyData, (error, studyId) => {
      if (error) {
        alert(`Error: ${error.reason}`);
      } else {
        alert('스터디가 성공적으로 생성되었습니다!');
        navigate('/');
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

      <div style={{ display: onOffline === "온라인" ? "none" : "block" }}>
        <label>지역</label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedGubun('');
          }}
          
        >
          <option value="">선택하세요</option>
          {cityList.map((city, index) => (
            <option key={index} value={city.name}>{city.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: onOffline === "온라인" ? "none" : "block" }}>
        <label>구</label>
        <select
          value={selectedGubun}
          onChange={(e) => setSelectedGubun(e.target.value)}
          
        >
          <option value="">선택하세요</option>
          {cityList
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

      {/* On/Offline Selection */}
      <div>
        <label>진행 방식</label>
        <div className="on-offline-selection">
          <label>
            <input
              type="radio"
              name="onOffline"
              value="온라인"
              checked={onOffline === "온라인"} defaultChecked
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
              value="백엔드" defaultChecked
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

      {/* Stars */}
      <div>
        <label>요구하는 평점</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleStarClick(star)} 
              style={{
                cursor: 'pointer',
                fontSize: '24px',
                color: rating >= star ? '#FFD700' : '#D3D3D3', 
              }}
            >
              ★
            </span>
          ))}
        </div>
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