import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import MypageNav from './MypageNav.jsx'; // 네비게이션 바 임포트
//import MyMain from "../../../client/css/mypage/MypageMain.css";

const MypageMain = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 사용자 데이터 가져오기
  const userData = useTracker(() => {

    const currentUserId = Meteor.userId();
    if (currentUserId) {
      return Meteor.users.findOne(currentUserId);
    }
    return null;
  }, []);

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
  const { nickname, profilePicture, address, techStack = [], roles = [], rating, recommendation=[] } = profile;

  return (
    <div className="mypage-container">
      {/* 네비게이션 바 */}
      <MypageNav />

      {/* 콘텐츠 영역 */}
      <div className="mypage-main">
        <h1>마이 페이지</h1>

        {/* 프로필 사진 */}
        <div className="profile-section">
          <img src={profilePicture} alt={`${nickname}의 프로필`} className="profile-picture" />
          <h2>{nickname}</h2>
        </div>

        {/* 사용자 기본 정보 */}
        <div className="user-info">
          <div>평점: {rating}</div>
          <div>
  {recommendation && Object.keys(recommendation).length > 0 && (
    <>
      <strong>추천:</strong>
      <ul>
        {recommendation.participation !== 0 && recommendation.participation && (
          <li><strong>참여도:</strong> {recommendation.participation}</li>
        )}
        {recommendation.teamwork !== 0 && recommendation.teamwork && (
          <li><strong>팀워크:</strong> {recommendation.teamwork}</li>
        )}
        {recommendation.leadership !== 0 && recommendation.leadership && (
          <li><strong>리더십:</strong> {recommendation.leadership}</li>
        )}
        {recommendation.communication !== 0 && recommendation.communication && (
          <li><strong>커뮤니케이션:</strong> {recommendation.communication}</li>
        )}
        {recommendation.timeliness !== 0 && recommendation.timeliness && (
          <li><strong>시간 준수:</strong> {recommendation.timeliness}</li>
        )}
      </ul>
    </>
  )}
</div>
          <p><strong>주소:</strong> {typeof address === 'object' ? `${address.city} ${address.gubun}` : address}</p>
        </div>

        {/* 기술 스택 */}
        <div className="tech-stack">
          <h3>기술 스택</h3>
          {techStack.length > 0 ? (
            <ul>
              {techStack.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          ) : (
            <p>기술 스택이 없습니다.</p>
          )}
        </div>

        {/* 역할 */}
        <div className="roles">
          <h3>역할</h3>
          {roles.length > 0 ? (
            <ul>
              {roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>
          ) : (
            <p>역할이 없습니다.</p>
          )}
        </div>

      
      </div>
    </div>
  );
};

export default MypageMain;
