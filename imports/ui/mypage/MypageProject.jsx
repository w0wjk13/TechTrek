import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import MypageNav from './MypageNav.jsx';

const MypageProject = () => {
  const [myStudies, setMyStudies] = useState([]);  // Created studies
  const [appliedStudies, setAppliedStudies] = useState([]);  // Applied studies
  const [loading, setLoading] = useState(true);
  const [ratedStudies, setRatedStudies] = useState([]); 

  // Current logged-in user ID
  const currentUser = Meteor.user();
  if (!currentUser) {
    console.error("User not logged in");
    return;
  }
  const currentUserId = currentUser._id; 
  const currentUserNickname = currentUser.profile?.nickname;
  // Navigate hook for routing
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStudies = async () => {
      setLoading(true);
      try {
        // Fetch studies created by the user
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getMyStudies', (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        setMyStudies(studies);
      } catch (error) {
        console.error('Failed to fetch created studies:', error.message);
      }
    };

    const fetchAppliedStudies = async () => {
      try {
        // Fetch studies the user has applied to
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getAppliedStudies', (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        const filteredAppliedStudies = studies.filter((study) => study.userId !== Meteor.user().profile.nickname);
        setAppliedStudies(filteredAppliedStudies);
      } catch (error) {
        console.error('Failed to fetch applied studies:', error.message);
      }
    };

    const fetchRatedStudies = async () => {
      if (currentUserNickname) {
        try {
          // 평가한 스터디 ID 목록 가져오기
          const ratedStudies = await new Promise((resolve, reject) => {
            Meteor.call('study.getRatedStudies', currentUserNickname, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            });
          });
          
          setRatedStudies(ratedStudies);   // 평가한 스터디 목록 상태 업데이트
        } catch (error) {
          console.error('Failed to fetch rated studies:', error.message);
        }
      }
    };

    if (currentUserId) {
      fetchMyStudies();
      fetchAppliedStudies();
      fetchRatedStudies();  //
    }
    setLoading(false);
  }, [currentUserId]);

  // Delete created study
  const handleDeleteStudy = (studyId) => {
    if (window.confirm('정말로 이 스터디를 삭제하시겠습니까?')) {
      Meteor.call('study.delete', studyId, (error) => {
        if (error) {
          console.error('Study delete failed:', error); // 서버에서 발생한 오류 로그
          alert('스터디 삭제에 실패했습니다.');
        } else {
          alert('스터디가 삭제되었습니다.');
          setMyStudies((prev) => prev.filter(study => study._id !== studyId));
        }
      });
    }
  };
  
  const handleCancelApplication = (studyId) => {
    if (window.confirm('정말로 이 스터디 신청을 취소하시겠습니까?')) {
      Meteor.call('study.cancelApplication', studyId, (error) => {
        if (error) {
          console.error('Application cancel failed:', error); // 서버에서 발생한 오류 로그
          alert('스터디 신청 취소에 실패했습니다.');
        } else {
          alert('스터디 신청이 취소되었습니다.');
          setAppliedStudies((prev) => prev.filter(study => study._id !== studyId));
        }
      });
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  const handleReview = (studyId) => {
    // 평가 페이지로 이동
    navigate(`/study/rating/${studyId}`);
  };
  
  
  return (
   <div>
        <MypageNav />
       <div className="myproject-mypage-container">
      <div className="myproject-mypage-content">
        {/* Created Studies */}
        <div className="myproject-section-title">내가 생성한 스터디</div>
        {myStudies.length === 0 ? (
          <div className="myproject-no-studies">생성한 스터디가 없습니다.</div>
        ) : (
          <ul className="myproject-studies-list">
            {myStudies.map((study) => (
              <li key={study._id} className="myproject-study-item">
                                <div className="myproject-study-deadline">
  {/* 마감일 출력 */}
  {study.status !== '모집완료' && study.studyClose ? (
    <div className="myproject-study-deadline-date">
      {new Date(study.studyClose).toLocaleDateString()} 마감
    </div>
  ) : (
    // 마감일이 없으면 진행 상태 출력
    study.status === '모집완료' && study.progress && (
      <div className={`myproject-study-progress myproject-progress-${study.progress.toLowerCase()}`}>
        스터디 {study.progress}
      </div>
    )
  )}
</div>
<div 
  className="myproject-study-title" 
  onClick={() => navigate(`/study/detail/${study._id}`)} // 클릭 시 상세 페이지로 이동
  style={{ cursor: 'pointer' }} // 클릭 가능하다는 시각적 표시
>
  <strong>{study.title}</strong>
</div>
                <div className="myproject-study-user">
                 {study.userId}
                </div>
               
           
                <div className={`myproject-status-${study.status}`}>
  {study.status}</div>
  {/* 모집완료 상태일 경우 신청자들 표시 */}
  {study.status === '모집완료' && study.applicants && study.applicants.length > 0 && (
    <div className="myproject-team-container">
      <div className="myproject-team-title">팀원</div>
      <ul>
        {study.applicants.map((applicant, index) => (
          <li key={index}>{applicant}</li> // 신청자의 이름 또는 닉네임을 표시
        ))}
      </ul>
    </div>
  )}



{study.status !== '모집완료' && (
  <div className="myproject-study-applicant">
    <div className="applicant-progress">
      {/* SVG 원형 진행 바 */}
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" stroke="#ccc" strokeWidth="5" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="#3498db"
          strokeWidth="5"
          fill="none"
          strokeDasharray={`${(study.applicantCount / study.studyCount) * 220} 220`}
          strokeLinecap="round"
        />
      </svg>
      <span className="applicant-icon">👥</span>
    </div>
    <div className="applicant-count">
      모집인원 {study.applicantCount} / {study.studyCount}
    </div>
  </div>
)}

                <div className="myproject-study-tech-stack">
                  <strong>기술 스택</strong>
                  <ul className="myproject-tech-list">
                    {study.techStack.map((tech, index) => (
                      <li key={index} className="myproject-tech-item">{tech}</li>
                    ))}
                  </ul>
                </div>
                {study.progress !== '예정' && (
  <div className="myproject-study-period">
    <strong>진행기간</strong>
    <div className="myproject-study-dates">
      <div className="myproject-study-start-date">
        <span className={study.startDate === '미정' ? 'date-mijeong' : ''}>
          {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
        </span>
      </div>
      <span className="date-separator">-</span>
      <div className="myproject-study-end-date">
        <span className={study.endDate === '미정' || isNaN(new Date(study.endDate)) ? 'date-mijeong' : ''}>
          {study.endDate === '미정' || isNaN(new Date(study.endDate)) ? '날짜 미정' : new Date(study.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
)}

               
                {study.progress === '종료'&& !ratedStudies.includes(String(study._id)) && (
                  <div className="myproject-study-review-button">
                    <button onClick={() => handleReview(study._id)}>평가하기</button>
                  </div>
                )}
                <div className="myproject-study-buttons">
              
                  <button onClick={() => handleDeleteStudy(study._id)}>삭제</button> {/* 삭제 버튼 */}
                </div>
               
              </li>
            ))}
          </ul>
        )}
  
        {/* Applied Studies */}
        <div className="myproject-section-title">내가 신청한 스터디</div>
        {appliedStudies.length === 0 ? (
          <div className="myproject-no-studies">신청한 스터디가 없습니다.</div>
        ) : (
          <ul className="myproject-studies-list">
            {appliedStudies.map((study) => (
              <li key={study._id} className="myproject-study-item">
                     <div className="myproject-study-deadline">
  {/* 마감일 출력 */}
  {study.status !== '모집완료' && study.studyClose ? (
    <div className="myproject-study-deadline-date">
      {new Date(study.studyClose).toLocaleDateString()} 마감
    </div>
  ) : (
    // 마감일이 없으면 진행 상태 출력
    study.status === '모집완료' && study.progress && (
      <div className={`myproject-study-progress myproject-progress-${study.progress.toLowerCase()}`}>
        스터디 {study.progress}
      </div>
    )
  )}
</div>
<div 
  className="myproject-study-title" 
  onClick={() => navigate(`/study/detail/${study._id}`)} // 클릭 시 상세 페이지로 이동
  style={{ cursor: 'pointer' }} // 클릭 가능하다는 시각적 표시
>
  <strong>{study.title}</strong>
</div>
                <div className="myproject-study-user">
                   {study.userId}
                </div>
               

                
                <div className={`myproject-status-${study.status}`}>
  {study.status}</div>
  {/* 모집완료 상태일 경우 신청자들 표시 */}
  {study.status === '모집완료' && study.applicants && study.applicants.length > 0 && (
    <div className="myproject-team-container">
      <div className="myproject-team-title">팀원</div>
      <ul>
        {study.applicants.map((applicant, index) => (
          <li key={index}>{applicant}</li> // 신청자의 이름 또는 닉네임을 표시
        ))}
      </ul>
    </div>
  )}



{study.status !== '모집완료' && (
  <div className="myproject-study-applicant">
    <div className="applicant-progress">
      {/* SVG 원형 진행 바 */}
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" stroke="#ccc" strokeWidth="5" fill="none" />
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="#3498db"
          strokeWidth="5"
          fill="none"
          strokeDasharray={`${(study.applicantCount / study.studyCount) * 220} 220`}
          strokeLinecap="round"
        />
      </svg>
      <span className="applicant-icon">👥</span>
    </div>
    <div className="applicant-count">
      모집인원 {study.applicantCount} / {study.studyCount}
    </div>
  </div>
)}





<div className="myproject-study-tech-stack">
                  <strong>기술 스택</strong>
                  <ul className="myproject-tech-list">
                    {study.techStack.map((tech, index) => (
                      <li key={index} className="myproject-tech-item">{tech}</li>
                    ))}
                  </ul>
                </div>
               
                {study.progress !== '예정' && (
  <div className="myproject-study-period">
    <strong>진행기간</strong>
    <div className="myproject-study-dates">
      <div className="myproject-study-start-date">
        <span className={study.startDate === '미정' ? 'date-mijeong' : ''}>
          {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
        </span>
      </div>
      <span className="date-separator">-</span>
      <div className="myproject-study-end-date">
        <span className={study.endDate === '미정' || isNaN(new Date(study.endDate)) ? 'date-mijeong' : ''}>
          {study.endDate === '미정' || isNaN(new Date(study.endDate)) ? '날짜 미정' : new Date(study.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
)}



                {study.progress === '종료' && !ratedStudies.includes(String(study._id)) && (
                   <div className="myproject-study-review-button">
                    <button onClick={() => handleReview(study._id)}>평가하기</button>
                  </div>
                )}
                <div className="myproject-study-buttons">
                  
                  {study.progress !== '종료' &&  (
                  <button onClick={() => handleCancelApplication(study._id)}>신청 취소</button> )} 
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

export default MypageProject;
