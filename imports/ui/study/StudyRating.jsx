import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useParams } from 'react-router-dom';

const StudyRating = () => {
  const { id } = useParams();
  const [filteredApplications, setFilteredApplications] = useState([]);  // 수락된 신청자 목록
  const [applications, setApplications] = useState([]);  // 전체 신청자 목록
  const [currentUserNickname, setCurrentUserNickname] = useState('');  // 현재 사용자 닉네임
  const [userId, setUserId] = useState(null);  // 현재 사용자 ID

  // 평가 데이터를 위한 상태들
  const [rating, setRating] = useState({});  // 각 신청자별 별점
  const [feedback, setFeedback] = useState({});  // 각 신청자별 피드백

  const initialRating = {
    participation: '',
    teamwork: '',
    leadership: '',
    communication: '',
    timeliness: ''
  };

  useEffect(() => {
    // 스터디 신청자 목록 가져오기
    Meteor.call('study.getApplications', id, (error, fetchedApplications) => {
      if (error) {
        console.error('신청자 목록 조회 실패:', error);
        return;
      }

    // 현재 로그인한 사용자의 정보 가져오기
    const currentUser = Meteor.user();
    if (currentUser) {
      setCurrentUserNickname(currentUser.profile?.nickname); // 현재 사용자 닉네임 저장
      setUserId(currentUser._id);  // 현재 사용자 ID 저장
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

  // 별점 클릭 핸들러
  const handleStarClick = (userId, value) => {
    setRating((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleItemClick = (userId, category) => {
    const currentRating = rating[userId] || {};
    const currentSelection = currentRating[category] === 'Selected' ? '' : 'Selected'; // 클릭 시 선택 상태 변경
    setRating((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [category]: currentSelection,
      },
    }));
  };

  // 피드백 핸들러
  const handleFeedbackChange = (userId, value) => {
    setFeedback((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  // 평가 제출
  const handleSubmit = () => {
    filteredApplications.forEach((application) => {
      application.applicants.forEach((applicant) => {
        const data = {
          studyId: id,
          userId: applicant.userId,
          rating: rating[applicant.userId],
          feedback: feedback[applicant.userId],
        };

        Meteor.call('study.submitRating', data, (error, result) => {
          if (error) {
            console.error('평가 제출 실패:', error);
          } else {
            console.log('평가 제출 성공:', result);
          }
        });
      });
    });
  };

  // 별 모양 생성 함수 (사용자가 클릭하여 별점을 선택할 수 있게)
  const renderStars = (userId) => {
    const userRating = rating[userId] || 0;
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(userId, star)}  // 별 클릭 시 평가 값 업데이트
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
                    {renderStars(applicant.userId)}  {/* 별점 표시 */}
                  </div><br/>

                  <div>
                    <label
                      onClick={() => handleItemClick(applicant.userId, 'participation')}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: rating[applicant.userId]?.participation === 'Selected' ? '#4CAF50' : '#f0f0f0',
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
                        backgroundColor: rating[applicant.userId]?.teamwork === 'Selected' ? '#4CAF50' : '#f0f0f0',
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
                        backgroundColor: rating[applicant.userId]?.leadership === 'Selected' ? '#4CAF50' : '#f0f0f0',
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
                        backgroundColor: rating[applicant.userId]?.communication === 'Selected' ? '#4CAF50' : '#f0f0f0',
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
                        backgroundColor: rating[applicant.userId]?.timeliness === 'Selected' ? '#4CAF50' : '#f0f0f0',
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
        </div>
      ) : (
        <p>수락된 신청자가 없습니다.</p>
      )}

      <button onClick={handleSubmit}>평가 제출</button>
    </div>
  );
};

export default StudyRating;
