import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import MypageNav from './MypageNav.jsx';

const MypageRating = () => {
  const [ratings, setRatings] = useState([]);  // 사용자 받은 평점 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 로그인된 유저 가져오기
    const currentUser = Meteor.user();
    
    // 로그인되지 않은 사용자는 로그인 페이지로 리디렉션
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userId = currentUser.profile?.nickname;  // 로그인된 사용자의 닉네임 가져오기

    if (!userId) {
      console.error("닉네임이 없습니다.");
      return;
    }

    // Meteor 호출: 현재 사용자가 받은 평가를 가져오기
    Meteor.call('study.getRatingsForUser', userId, (error, result) => {
      setLoading(false);  // 로딩 완료

      if (error) {
        console.error('평가 조회 실패:', error);
        return;
      }

      console.log('받은 평가 결과:', result);  // 결과 콘솔 출력

      setRatings(result);  // 받은 평가 데이터 저장
    });
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;  // 로딩 상태 표시
  }

  return (
    <div>
      <div className="mypage-nav">
        <MypageNav />
      </div>
      <h3>내 평가 목록</h3>

      {ratings.length > 0 ? (
        <div>
          {ratings.map((rating, index) => (
            <div key={index} className="rating-item">
              <div><strong>스터디 ID:</strong> {rating.studyId}</div>
              <div><strong>평가자:</strong> {rating.userId}</div> {/* 평가자 정보 출력 */}
              <div><strong>평가 점수:</strong> {rating.rating}</div>

              {/* 추천 항목 */}
              <div><strong>추천 항목:</strong></div>
              <ul>
                {Object.entries(rating.recommendation).map(([key, value]) => (
                  value === 'Selected' ? <li key={key}>{key}</li> : null
                ))}
              </ul>
                {rating.feedback && rating.feedback.trim() !== '' && (
  <div><strong>코멘트:</strong>{rating.feedback}</div>
)}
              <div><strong>평가 작성일:</strong> {new Date(rating.createdAt).toLocaleString()}</div><hr/>
            </div>
          ))}
        </div>
      ) : (
        <p>받은 평가가 없습니다.</p>
      )}
    </div>
  );
};

export default MypageRating;
