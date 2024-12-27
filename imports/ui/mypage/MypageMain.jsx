import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import MypageNav from './MypageNav.jsx'; // 네비게이션 바 임포트

// 날짜를 원하는 형식으로 포맷팅하는 함수
const formatDate = (date) => {
  if (!date) {
    return "날짜 정보 없음"; // 날짜 정보가 없다면 출력할 기본 텍스트
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return "유효하지 않은 날짜"; // 유효하지 않은 날짜가 있을 경우
  }

  return `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
};

const MypageMain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [completedStudies, setCompletedStudies] = useState([]);  // 종료된 스터디 상태 추가

  // 사용자 데이터 가져오기
  const userData = useTracker(() => {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      return Meteor.users.findOne(currentUserId);
    }
    return null;
  }, []); 

  // 종료된 스터디 데이터 가져오기
  useEffect(() => {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      // Meteor.call로 비동기 호출을 사용하여 완료된 스터디 목록 가져오기
      Meteor.call('study.getCompletedStudies', (error, result) => {
        if (error) {
          console.error('Error fetching completed studies:', error);
        } else {
          setCompletedStudies(result);  // 종료된 스터디 목록을 상태에 저장
        }
      });
    }
  }, []);  // 빈 배열로 실행 시 한 번만 호출

  useEffect(() => {
    if (userData) {
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!userData) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  const { profile } = userData;
  const { nickname, profilePicture, address, techStack = [], roles = [], rating, recommendation = [] } = profile;

  function getRatingColor(rating) {
    if (rating >= 4.5) {
      return '#4F92B8'; // 높은 평점은 대표 색상
    } else if (rating >= 3) {
      return '#67A9C5'; // 중간 평점은 조금 더 연한 파랑
    } else {
      return '#E74C3C'; // 낮은 평점은 빨간색
    }
  }

  const handleStudyClick = (studyId) => {
    navigate(`/study/detail/${studyId}`);  // 클릭 시 해당 studyId로 이동
  };

  return (
    <div className="mypage-container">
      {/* 네비게이션 바 */}
      <MypageNav />

      {/* 콘텐츠 영역 */}
      <div className="mypage-content">

        {/* 프로필 섹션 */}
        <div className="profile-section">
          <div className="profile-image-container">
            <img src={profilePicture} alt={`${nickname}의 프로필`} className="profile-image" />
          </div>
          <div className="profile-info">
            <h2 className="profile-nickname">{nickname}</h2>
          </div>
        </div>

        {/* 사용자 기본 정보 */}
        <div className="user-info">
        <div className="user-rating">
  <div className="progress-bar-container">
    {/* Progress Bar */}
    <div className="progress-bar">
      <div 
        className="progress-bar-fill" 
        style={{
          width: `${(rating / 5) * 100}%`, 
          backgroundColor: getRatingColor(rating)
        }}
      >
        {/* 내 평점 텍스트 */}
        <div className="rating-text">{rating.toFixed(1)}</div>
      </div>
    </div>

    {/* 평점 구간 표시 */}
    <div className="rating-scale">
      {Array.from({ length: 5 }, (_, index) => (
        <div 
          key={index} 
          className={`rating-point ${index + 1 <= rating ? 'highlight' : ''}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  </div>
</div>

          {/* 추천 항목 */}
          <div className="user-recommendation">
  {recommendation && Object.keys(recommendation).length > 0 && (
    <div className="recommendation-list">
      <ul className="recommendation-items">
        {recommendation.participation !== 0 && recommendation.participation && (
          <li className="recommendation-item">
            <span className="icon">🏅</span>
            <strong>참여도</strong>
            <span>+{recommendation.participation}</span>
          </li>
        )}
        {recommendation.teamwork !== 0 && recommendation.teamwork && (
          <li className="recommendation-item">
            <span className="icon">🤝</span>
            <strong>팀워크</strong>
            <span>+{recommendation.teamwork}</span>
          </li>
        )}
        {recommendation.leadership !== 0 && recommendation.leadership && (
          <li className="recommendation-item">
            <span className="icon">👑</span>
            <strong>리더십</strong>
            <span>+{recommendation.leadership}</span>
          </li>
        )}
        {recommendation.communication !== 0 && recommendation.communication && (
          <li className="recommendation-item">
            <span className="icon">💬</span>
            <strong>커뮤니케이션</strong>
            <span>+{recommendation.communication}</span>
          </li>
        )}
        {recommendation.timeliness !== 0 && recommendation.timeliness && (
          <li className="recommendation-item">
            <span className="icon">⏰</span>
            <strong>시간 준수</strong>
            <span>+{recommendation.timeliness}</span>
          </li>
        )}
      </ul>
    </div>
  )}
</div>

        </div>

        {/* 기술 스택 */}
        <div className="tech-stack">
          <h3 className="tech-stack-title">기술 스택</h3>
          {techStack.length > 0 ? (
            <ul className="tech-stack-list">
              {techStack.map((tech, index) => (
                <li key={index} className="tech-stack-item">{tech}</li>
              ))}
            </ul>
          ) : (
            <p className="no-tech-stack">기술 스택이 없습니다.</p>
          )}
        </div>

        {/* 역할 */}
        <div className="roles">
          <h3 className="roles-title">역할</h3>
          {roles.length > 0 ? (
            <ul className="roles-list">
              {roles.map((role, index) => (
                <li key={index} className="role-item">{role}</li>
              ))}
            </ul>
          ) : (
            <p className="no-roles">역할이 없습니다.</p>
          )}
        </div>

        {/* 종료된 스터디 */}
        <div className="completed-studies">
          <div className="completed-studies-title">프로젝트 이력</div>
          {completedStudies.length === 0 ? (
            <div className="no-completed-studies">참여한 스터디가 없습니다.</div>
          ) : (
            <ul className="completed-studies-list">
              {completedStudies.map((study) => (
                <li key={study._id} className="completed-study-item">
                    <div
                className="study-title"
                onClick={() => handleStudyClick(study._id)}  // 제목 클릭 시 handleStudyClick 함수 실행
              >
                {study.title}
              </div>
                  <div className="study-dates">
                    <div className="study-start-date"><span>프로젝트기간: </span> {formatDate(study.startDate)}</div>
                    <div className="study-end-date"><span> ~</span> {formatDate(study.endDate)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MypageMain;
