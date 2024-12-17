import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import MypageNav from './MypageNav.jsx';

const MypageRating = () => {
  const [ratings, setRatings] = useState([]);  // 사용자 받은 평점 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [recommendationCounts, setRecommendationCounts] = useState({
    participation: 0,
    teamwork: 0,
    leadership: 0,
    communication: 0,
    timeliness: 0
  });
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

      setRatings(result);  // 받은 평가 데이터 저장
      const counts = {
        participation: 0,
        teamwork: 0,
        leadership: 0,
        communication: 0,
        timeliness: 0
      };
      result.forEach(rating => {
        // 각 추천 항목에 대해 값이 1이면 카운트 증가
        for (let key in counts) {
          if (rating.recommendation[key] === 1) {
            counts[key]++;
          }
        }
      });

      setRecommendationCounts(counts); 
    });
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;  // 로딩 상태 표시
  }

  // 스터디 ID별로 평가들을 묶기
  const groupedRatings = ratings.reduce((groups, rating) => {
    const studyId = rating.studyId;
    if (!groups[studyId]) {
      groups[studyId] = [];
    }
    groups[studyId].push(rating);
    return groups;
  }, {});

  return (
    <div>
      <div className="mypage-nav">
        <MypageNav />
      </div>
      <h3>내 평가 목록</h3>

      {Object.keys(groupedRatings).length > 0 ? (
        <div>
          {Object.entries(groupedRatings).map(([studyId, studyRatings], index) => (
            <div key={studyId}>
              {/* 각 스터디 ID별로 구분해서 출력 */}
              <h4>스터디 ID: {studyId}</h4>
              {studyRatings.map((rating, idx) => (
                <div key={idx} className="rating-item">
                  <div><strong>평가자:</strong> {rating.userId}</div> {/* 평가자 정보 출력 */}
                  <div><strong>평가 점수:</strong> {rating.rating}</div>

                  <div><strong>추천 항목:</strong></div>
                  <ul>
                    {Object.entries(rating.recommendation).map(([key, value]) => (
                      value === 1 ? <li key={key}>{key}: {value}</li> : null
                    ))}
                  </ul>
                  
                  {rating.feedback && rating.feedback.trim() !== '' && (
                    <div><strong>코멘트:</strong> {rating.feedback}</div>
                  )}
                  <div><strong>평가 작성일:</strong> {new Date(rating.createdAt).toLocaleString()}</div>
                  <br/>
                </div>
              ))}<hr />
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
