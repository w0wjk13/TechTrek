import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams, useNavigate } from 'react-router-dom';

const StudyRating = () => {
  const { id } = useParams();
  const [filteredApplications, setFilteredApplications] = useState([]);  // 수락된 신청자 목록
  const [applications, setApplications] = useState([]);  // 전체 신청자 목록
  const [currentUserNickname, setCurrentUserNickname] = useState('');  // 현재 사용자 닉네임
  const [userId, setUserId] = useState(null);  // 현재 사용자 ID

  // 별점과 항목 상태들을 독립적으로 관리
  const [ratings, setRatings] = useState({});  // 각 신청자별 별점
  const [selectedItems, setSelectedItems] = useState({});  // 각 항목의 선택 상태 (participation, teamwork 등)
  const [feedback, setFeedback] = useState({});  // 각 신청자별 피드백
  
  
  const [existingRating, setExistingRating] = useState(false);  // 이미 평가한 상태 추적
  const [submitButtonVisible, setSubmitButtonVisible] = useState(true);  // 제출 버튼 보이기 여부
  const navigate = useNavigate();
  useEffect(() => {
    const currentUser = Meteor.user();
    if (currentUser) {
      setCurrentUserNickname(currentUser.profile?.nickname); // 현재 사용자 닉네임 저장
      setUserId(currentUser._id);  // 현재 사용자 ID 저장
    }

    // 이미 평가한 사용자 확인
    Meteor.call('study.getExistingRating', id, currentUser?.profile?.nickname, (error, result) => {
      if (error) {
        if (error.error === 'already-rated') {
          alert(error.reason);  // 이미 평가한 경우 경고 메시지
          navigate('/mypage/project');  // 프로젝트 페이지로 리디렉션
          return;
        } else {
          console.error('평가 상태 확인 실패:', error);  // 다른 오류 처리
        }
      } else {
        setApplications(result);  // 신청자 목록 업데이트
      }
    });

    // 스터디 신청자 목록 가져오기
    Meteor.call('study.getApplications', id, (error, fetchedApplications) => {
      if (error) {
        console.error('신청자 목록 조회 실패:', error);
        return;
      }

      // 현재 사용자를 제외한 신청자만 필터링
      const filteredApplications = fetchedApplications.map(app => {
        const filteredApplicants = (app.userIds || []).map((userId, index) => {
          const applicantState = (app.states || [])[index];  // 해당 신청자의 상태
          const applicant = {
            userId,
            state: applicantState,
            nickname: (app.nicknames || [])[index],  // 신청자의 닉네임
          };

          // 현재 사용자를 제외하고 수락된 신청자만 필터링
          return applicant.state === '수락' && applicant.userId !== currentUserNickname;
        }).filter(Boolean);  // 필터링된 신청자만 남깁니다.

        return {
          ...app,
          applicants: filteredApplicants,
        };
      });

      setApplications(filteredApplications);  // 필터링된 신청자 목록 저장
    });
  }, [id]);

  useEffect(() => {
    // 신청자 목록 필터링 처리: 거절된 신청자는 제외하고 수락된 신청자만 필터링
    const getFilteredApplications = () => {
      return applications.map(app => {
        const filteredApplicants = (app.userIds || []).map((userId, index) => {
          const applicantState = (app.states || [])[index];  // 해당 신청자의 상태
          return {
            userId,
            state: applicantState,
            nickname: (app.nicknames || [])[index]  // 신청자의 닉네임
          };
        }).filter(applicant => 
          applicant.state === '수락' && applicant.userId !== currentUserNickname // 현재 사용자를 제외한 수락된 신청자만 필터링
        );  

        return {
          ...app,
          applicants: filteredApplicants
        };
      });
    };

    if (applications.length > 0) {
      setFilteredApplications(getFilteredApplications());
    }
  }, [applications, currentUserNickname]);

  // 별점 클릭 핸들러 (별점 항목 별로 관리)
  const handleStarClick = (userId, value, category) => {
    setRatings((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [category]: value,  // 해당 category 항목만 별점 업데이트
      },
    }));
  };

  const handleItemClick = (userId, category) => {
    setSelectedItems((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [category]: prev[userId]?.[category] === 1 ? 0 : 1,  // 1로 선택, 0으로 해제
      },
    }));
  };

  // 피드백 핸들러
  const handleFeedbackChange = (userId, value) => {
    setFeedback((prev) => ({
      ...prev,
      [userId]: value.trim() || '',  // trim()을 이용해 공백만 있는 피드백도 빈 문자열로 처리
    }));
  };

  // 평가 제출
  const handleSubmit = () => {
    const totalApplications = filteredApplications.length * filteredApplications.reduce((acc, app) => acc + app.applicants.length, 0);
    
    const submitPromises = [];

    for (const application of filteredApplications) {
      for (const applicant of application.applicants) {
        const rating = ratings[applicant.userId]?.participation || 0;

        if (!rating || rating === 0) {
          alert(`${applicant.userId}님에 대한 평점을 입력해주세요.`);
          return;
        }

        const recommendation = {
          participation: selectedItems[applicant.userId]?.participation === 1 ? 1 : 0,
          teamwork: selectedItems[applicant.userId]?.teamwork === 1 ? 1 : 0,
          leadership: selectedItems[applicant.userId]?.leadership === 1 ? 1 : 0,
          communication: selectedItems[applicant.userId]?.communication === 1 ? 1 : 0,
          timeliness: selectedItems[applicant.userId]?.timeliness === 1 ? 1 : 0,
        };

        const feedbackText = feedback[applicant.userId] || ''; 
        const data = {
          studyId: id,
          ratedUserId: applicant.userId,
          rating: rating,
          recommendation: recommendation,
          feedback: feedbackText,
        };

        submitPromises.push(
          new Promise((resolve, reject) => {
            Meteor.call('study.submitRating', data, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          })
        );
      }
    }

    // 모든 평가 제출이 완료되면 처리
    Promise.all(submitPromises)
      .then(() => {
        if (totalApplications) {
          alert('평가가 성공적으로 제출되었습니다!');
          navigate('/mypage/project');
        } else {
          alert('평가 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      })
      .catch((error) => {
        console.error('평가 제출 중 오류 발생:', error);
        alert('평가 제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
      });
  };

  // 별 모양 생성 함수 (사용자가 클릭하여 별점을 선택할 수 있게)
  const renderStars = (userId, category) => {
    const userRating = ratings[userId]?.[category] || 0;  // 해당 항목의 별점 가져오기
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(userId, star, category)}  // 별 클릭 시 해당 항목의 별점만 업데이트
            style={{
              cursor: 'pointer',
              fontSize: '24px',
              color: userRating >= star ? '#FFD700' : '#D3D3D3',  // 선택된 별은 금색, 나머지는 회색
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  return (
    <div>
      <h3>스터디 평가</h3>

      {/* 수락된 신청자 목록만 표시, 현재 사용자 제외 */}
      {filteredApplications.length > 0 ? (
        <div>
          {filteredApplications.map((application, index) => (
            <div key={index}>
              {application.applicants.map((applicant) => (
                <div key={applicant.userId}>
                  <strong>{applicant.nickname || applicant.userId}</strong> - {applicant.state}

                  {/* 별점 평가 */}
                  <div>
                    <label>요구하는 평점: </label>
                    {renderStars(applicant.userId, 'participation')}  {/* 별점 표시 */}
                  </div><br/>
                  
                  {/* 항목별 평가 클릭 */}
                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'participation')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedItems[applicant.userId]?.participation === 1 ? '#4CAF50' : '#f0f0f0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      Participation
                    </label>
                  </div><br/>

                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'teamwork')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedItems[applicant.userId]?.teamwork === 1 ? '#4CAF50' : '#f0f0f0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      Teamwork
                    </label>
                  </div><br/>

                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'leadership')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedItems[applicant.userId]?.leadership === 1 ? '#4CAF50' : '#f0f0f0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      Leadership
                    </label>
                  </div><br/>

                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'communication')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedItems[applicant.userId]?.communication === 1 ? '#4CAF50' : '#f0f0f0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      Communication
                    </label>
                  </div><br/>

                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'timeliness')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedItems[applicant.userId]?.timeliness === 1 ? '#4CAF50' : '#f0f0f0',
                        padding: '5px 10px',
                        margin: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      Timeliness
                    </label>
                  </div><br/>

                  {/* 피드백 */}
                  <div>
                    <label>피드백: </label>
                    <textarea
                      value={feedback[applicant.userId] || ''}
                      onChange={(e) => handleFeedbackChange(applicant.userId, e.target.value)}
                    />
                  </div><br/>
                </div>
              ))}
            </div>
          ))}
           <button onClick={handleSubmit} >평가 제출</button>
        </div>
        
      ) : (
        <p>이미 평가한 사용자입니다. 평가 페이지에 접근할 수 없습니다.</p>
      )}

     
    </div>
  );
};

export default StudyRating;
