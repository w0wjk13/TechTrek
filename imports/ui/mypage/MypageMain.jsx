import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

const MyPageMain = () => {
  const { user, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("userProfile"); // 서버에서 프로필 데이터 구독
    return {
      user: Meteor.user(), // 현재 로그인한 사용자
      isLoading: !handle.ready(), // 퍼블리케이션이 준비되었는지 확인
    };
  });


  // 로그인하지 않은 경우
  if (!user) {
    return <div>사용자 데이터를 찾을 수 없습니다.</div>;
  }

  // 프로필 정보 가져오기
  const { profile } = user;

  return (
    <div className="mypage-container">
      <div className="profile-header">
        <img
          src={profile.profilePicture || "https://example.com/default-profile.jpg"}
          alt="Profile"
          className="profile-image"
        />
        <div className="user-info">
          <h2>{profile.name}</h2>
          <p><strong>닉네임: </strong>{profile.nickname}</p>
          <p><strong>이메일: </strong>{user.email}</p>
        </div>
      </div>

      <div className="tech-stack">
        <h3>기술 스택</h3>
        <ul>
          {profile.techStack && profile.techStack.length > 0 ? (
            profile.techStack.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))
          ) : (
            <li>기술 스택이 선택되지 않았습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyPageMain;
