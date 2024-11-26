import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const MypageMain = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserId = Meteor.userId();
    if (currentUserId) {
      const user = Meteor.users.findOne(currentUserId);
      setUserData(user);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!userData) {
    return <div>로그인된 사용자가 없습니다.</div>;
  }

  const { profile, email, createdAt } = userData;
  const { name, nickname, phone, profilePicture, address, techStack, roles, score } = profile;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="mypage-main">
      <h1>마이 페이지</h1>
      
      {/* 프로필 사진 */}
      <div className="profile-section">
        <img src={profilePicture} alt={`${nickname}의 프로필`} className="profile-picture" />
        <h2>{nickname}</h2>
      </div>

      {/* 사용자 기본 정보 */}
      <div className="user-info">
        <p><strong>이름:</strong> {name}</p>
        <p><strong>닉네임:</strong> {nickname}</p>
        
        <p><strong>전화번호:</strong> {phone}</p>
        <p><strong>주소:</strong> {address}</p>
        
      </div>

      {/* 기술 스택 */}
      <div className="tech-stack">
        <h3>기술 스택</h3>
        <ul>
          {techStack && techStack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>

      {/* 역할 */}
      <div className="roles">
        <h3>역할</h3>
        <ul>
          {roles && roles.map((role, index) => (
            <li key={index}>{role}</li>
          ))}
        </ul>
      </div>

      {/* 점수 */}
      <div className="score">
        <h3>점수</h3>
        <ul>
          <li><strong>매너:</strong> {score?.manner}</li>
          <li><strong>멘토링:</strong> {score?.mentoring}</li>
          <li><strong>열정:</strong> {score?.passion}</li>
          <li><strong>의사소통:</strong> {score?.communication}</li>
          <li><strong>시간 준수:</strong> {score?.time}</li>
        </ul>
      </div>

     
    </div>
  );
};

export default MypageMain;
