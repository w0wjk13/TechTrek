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
  const [showDescription, setShowDescription] = useState(false);
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

  const descriptions = {
    participation: '참여도는 스터디나 프로젝트에 얼마나 적극적으로 참여했는지 평가합니다.',
    teamwork: '팀워크는 다른 사람들과 협력하며 목표를 달성하는 능력을 평가합니다.',
    leadership: '리더십은 팀을 이끌며 주도적으로 문제를 해결하는 능력을 평가합니다.',
    communication: '소통 능력은 의사소통을 얼마나 잘하는지 평가합니다.',
    timeliness: '시간 관리는 주어진 시간과 기한을 얼마나 잘 지켰는지 평가합니다.'
  };
  return (
    <div className="mypage-nav">
      <MypageNav />
      <div className="myrating">
      <div className="myrating-title">평가 목록</div>
      <div 
          className="myrating-tooltip-icon"
          onClick={() => setShowDescription(!showDescription)}
        >
          ❔
        </div>
        <div className={`myrating-description ${showDescription ? 'show' : 'hide'}`}>
        <div><strong>participation:</strong> {descriptions.participation}</div>
        <div><strong>teamwork:</strong> {descriptions.teamwork}</div>
       <div><strong>leadership:</strong> {descriptions.leadership}</div>
       <div><strong>communication:</strong> {descriptions.communication}</div>
        <div><strong>timeliness:</strong> {descriptions.timeliness}</div>
      </div>

      {Object.keys(groupedRatings).length > 0 ? (
        <div className="myrating-list">
          {Object.entries(groupedRatings).map(([studyId, studyRatings], index) => (
            <div key={studyId} className="myrating-study-item">
              {/* 각 스터디 ID별로 구분해서 출력 */}
              <div className="myrating-study-id" onClick={() => navigate(`/study/detail/${studyId}`)}> {studyRatings[0].studyTitle}</div>
              {studyRatings.map((rating, idx) => (
                <div key={idx} className="myrating-rating-item">
                  <div className="myrating-user"><strong>평가자:</strong> {rating.userId}</div> {/* 평가자 정보 출력 */}
                  <div className="myrating-score">
            {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
           className={rating.rating > index ? 'star' : 'empty-star'}
           >
          ★
           </span>
           ))}

          </div>

                  <div className="myrating-recommendations">
                  <ul>
                    {Object.entries(rating.recommendation).map(([key, value]) => (
                      value === 1 ? <li key={key}>{key}</li> : null
                    ))}
                  </ul>
                  </div>
                  {rating.feedback && rating.feedback.trim() !== '' && (
                    <div className="myrating-feedback"><strong>🗣️</strong> {rating.feedback}</div>
                  )}
                  <div className="myrating-created-at"><strong></strong> {new Date(rating.createdAt).toLocaleString()}</div>
                
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="myrating-no-feedback">받은 평가가 없습니다.</p>
      )}
    </div>
    </div>
  );
};

export default MypageRating;
