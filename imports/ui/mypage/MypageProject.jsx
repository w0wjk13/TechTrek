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
    <div className="mypage-container">
      <div className="mypage-nav">
        <MypageNav />
      </div>
      <div className="mypage-content">
        {/* Created Studies */}
        <h1>내가 생성한 스터디</h1>
        {myStudies.length === 0 ? (
          <div>생성한 스터디가 없습니다.</div>
        ) : (
          <ul>
            {myStudies.map((study) => (
              <li key={study._id}>
                <div>
                  <strong>제목:</strong> {study.title}
                </div>
                <div>
                  <strong>작성자:</strong> {study.userId}
                </div>
                <div>
                  <strong>등록일:</strong> {new Date(study.createdAt).toLocaleDateString()}
                </div>
                <div>
  {study.status !== '모집완료' && (
    <>
      <strong>모집 마감일:</strong> {new Date(study.studyClose).toLocaleDateString()}
    </>
  )}
</div>
                <div>
                  <strong>모집 상태:</strong> {study.status}
                </div>
                {study.status !== '모집완료' && (
  <>
    <div>
      <strong>모집 인원:</strong> {study.studyCount}
    </div>
    <div>
      <strong>신청자:</strong> {study.applicantCount}
    </div>
    
  </>
)}


                <div>
                  <strong>진행 상태:</strong> {study.progress}
                </div>
                {study.progress !== '예정' && (
  <>
    <div>
      <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
    </div>
    <div>
      <strong>종료일:</strong> 
      {study.endDate === '미정' || isNaN(new Date(study.endDate)) 
        ? '날짜 미정' 
        : new Date(study.endDate).toLocaleDateString()}
    </div>
  </>
)}

                <div>
                  <strong>기술 스택:</strong>
                  <ul>
                    {study.techStack.map((tech, index) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
                {study.progress === '종료'&& !ratedStudies.includes(String(study._id)) && (
                  <div>
                    <button onClick={() => handleReview(study._id)}>평가하기</button>
                  </div>
                )}
                <div>
                  <button onClick={() => navigate(`/study/detail/${study._id}`)}>상세보기</button>
                  <button onClick={() => handleDeleteStudy(study._id)}>삭제</button> {/* 삭제 버튼 */}
                </div>
               
              </li>
            ))}
          </ul>
        )}

        {/* Applied Studies */}
        <h1>내가 신청한 스터디</h1>
        {appliedStudies.length === 0 ? (
          <div>신청한 스터디가 없습니다.</div>
        ) : (
          <ul>
            {appliedStudies.map((study) => (
              <li key={study._id}>
                <div>
                  <strong>제목:</strong> {study.title}
                </div>
                <div>
                  <strong>작성자:</strong> {study.userId}
                </div>
                <div>
                  <strong>등록일:</strong> {new Date(study.createdAt).toLocaleDateString()}
                </div>
                <div>
  {study.status !== '모집완료' && (
    <>
      <strong>모집 마감일:</strong> {new Date(study.studyClose).toLocaleDateString()}
    </>
  )}
</div>
                <div>
                  <strong>모집 상태:</strong> {study.status}
                </div>
                {study.status !== '모집완료' && (
  <>
    <div>
      <strong>모집 인원:</strong> {study.studyCount}
    </div>
    <div>
      <strong>신청자:</strong> {study.applicantCount}
    </div>
  </>
)}

                <div>
                  <strong>진행 상태:</strong> {study.progress}
                </div>
                {study.progress !== '예정' && (
  <>
    <div>
      <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
    </div>
    <div>
      <strong>종료일:</strong> 
      {study.endDate === '미정' || isNaN(new Date(study.endDate)) 
        ? '날짜 미정' 
        : new Date(study.endDate).toLocaleDateString()}
    </div>
  </>
)}


                <div>
                  <strong>기술 스택:</strong>
                  <ul>
                    {study.techStack.map((tech, index) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
                {study.progress === '종료' && !ratedStudies.includes(String(study._id)) && (
                  <div>
                    <button onClick={() => handleReview(study._id)}>평가하기</button>
                  </div>
                )}
                <div>
                  <button onClick={() => navigate(`/study/detail/${study._id}`)}>상세보기</button>
                  <button onClick={() => handleCancelApplication(study._id)}>신청 취소</button> {/* 취소 버튼 */}
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MypageProject;
