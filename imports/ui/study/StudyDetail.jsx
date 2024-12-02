import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Study, Comment, Application } from '/imports/api/collections';  // 수정된 컬렉션 불러오기

const StudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // URL에서 id를 가져옴
  const [studyData, setStudyData] = useState(null);
  const [username, setUsername] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  // 현재 로그인한 사용자 ID
  const currentUserNickname = Meteor.user()?.profile?.nickname || '';

  useEffect(() => {
    // 데이터 로딩 시작
    setLoading(true);

    // studyData와 username을 비동기적으로 가져오기
    Meteor.call('study.getStudyDetails', id, (error, study) => {
      if (error) {
        console.error('스터디 정보 조회 실패:', error);
        setLoading(false);
        return;
      }
      setStudyData(study);

      // 작성자 정보를 Meteor.users에서 가져오기
      const user = Meteor.users.findOne(study.userId);
      const username = user?.profile?.nickname || user?.username || '알 수 없음';
      setUsername(username);

      // 해당 스터디의 댓글 정보 가져오기 (comment 컬렉션에서)
      const studyComments = Comment.find({ studyId: id }).fetch();
      setComments(studyComments);

      // 스터디에 신청한 사용자들 가져오기 (Application 컬렉션에서)
      const studyApplications = Application.find({ studyId: id }).fetch();

      // 신청자 상태 및 정보를 합친 배열 생성
    // 신청자 상태 및 정보를 합친 배열 생성
    let applicants = [];

    if (Array.isArray(studyApplications)) {
      for (let i = 0; i < studyApplications.length; i++) {
        const app = studyApplications[i];
    
        // userIds와 states가 배열인지 확인하고, 아니면 단일 userId와 state 처리
        if (Array.isArray(app.userIds) && Array.isArray(app.states)) {
          const processedApplicants = [];
    
          // userIds와 states를 순회하여 신청자 상태 및 정보를 합침
          for (let j = 0; j < app.userIds.length; j++) {
            const userId = app.userIds[j];
            const user = Meteor.users.findOne(userId);
            processedApplicants.push({
              userId,
              state: app.states[j],
              nickname: user?.profile?.nickname || user?.username || '알 수 없음',
            });
          }
    
          // processedApplicants 배열을 신청서에 포함
          applicants.push({
            ...app,
            applicants: processedApplicants,
          });
        } else {
          // userIds나 states가 배열이 아니면 단일 userId와 state로 처리
          const userId = app.userId;
          const user = Meteor.users.findOne(userId);
    
          applicants.push({
            ...app,
            applicants: [
              {
                userId,
                state: app.state,
                nickname: user?.profile?.nickname || user?.username || '알 수 없음',
              },
            ],
          });
        }
      }
    }
    
    
    

      setApplications(applicants);

      // 데이터 로딩 완료
      setLoading(false);
    });
    // 페이지가 로드될 때 조회수 증가
    Meteor.call('study.incrementViews', id, (error, result) => {
      if (error) {
        console.error('조회수 증가 실패:', error);
      }
    });
  }, [id]);  // id가 변경될 때마다 실행

  // 모집 마감일이 지나면 모집 상태를 '모집마감'으로 변경
  useEffect(() => {
    if (studyData && studyData.studyClose) {
      const studyCloseDate = new Date(studyData.studyClose);
      const currentDate = new Date();

      if (currentDate > studyCloseDate && studyData.status !== '모집마감') {
        // 마감일이 지나면 상태를 '모집마감'으로 변경
        Meteor.call('study.updateStatus', id, '모집마감', (error) => {
          if (error) {
            console.error('모집 상태 변경 실패:', error);
          } else {
            setStudyData(prevState => ({
              ...prevState,
              status: '모집마감',
            }));
          }
        });
      }
    }
  }, [studyData]);  // studyData가 변경될 때마다 실행

  // 댓글 입력 처리
  const handleCommentSubmit = () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    Meteor.call('study.addComment', id, commentContent, (error, result) => {
      if (error) {
        console.error('댓글 작성 실패:', error);
      } else {
        setCommentContent('');
        // 댓글 추가 후 UI에 반영
        setComments((prevComments) => [
          ...prevComments,
          {
            userId: currentUserNickname,
            nickname: Meteor.user()?.profile?.nickname || '알 수 없음',
            content: commentContent,
            createdAt: new Date(),
          },
        ]);
      }
    });
  };

  // 신청하기 버튼 클릭 처리
  const handleApply = () => {
    const isAlreadyApplied = applications.some((app) =>
      app.applicants.some((applicant) =>
        applicant.userId === currentUserNickname && applicant.state === '신청'
      )
    );
  
    // 이미 신청한 경우
    if (isAlreadyApplied) {
      alert('이미 신청한 상태입니다.');
      return;
    }

    Meteor.call('study.apply', id, (error, result) => {
      if (error) {
        // 'already-applied' 오류일 경우, 이미 신청한 상태로 간주하고 알림 처리
        if (error.error === 'already-applied') {
          alert('이미 신청한 상태입니다.');
        } else {
          // 그 외의 오류 처리
          console.error('스터디 신청 실패:', error.message || error);  // error 객체에서 메시지 출력
          alert('스터디 신청에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        // 신청 성공 시, applications에 추가
        setApplications((prevApplications) => [
          ...prevApplications,
          {
            applicants: [
              {
                userId: currentUserNickname,
                state: '신청',
                user: Meteor.users.findOne(currentUserNickname), // 신청한 유저 정보
              },
            ],
          },
        ]);
        alert('스터디 신청이 완료되었습니다.');
      }
    });
  };


  // 신청 상태 수락 처리
  const handleAccept = (applicantId) => {
    const application = Application.findOne({ studyId: id, 'userIds': applicantId });

    if (!application) {
      alert('해당 신청자가 없습니다.');
      return;
    }

    Meteor.call('study.acceptApplication', id, applicantId, (error, result) => {
      if (error) {
        console.error('수락 실패:', error);
      } else {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.applicants.some((applicant) => applicant.userId === applicantId)
              ? {
                ...app,
                applicants: app.applicants.map((applicant) =>
                  applicant.userId === applicantId
                    ? { ...applicant, state: '수락' }  // 상태를 '수락됨'으로 변경
                    : applicant
                ),
              }
              : app
          )
        );
      }
    });
  };

  // 신청 상태 거절 처리
  const handleReject = (applicantId) => {
    const application = Application.findOne({ studyId: id, 'userIds': applicantId });

    if (!application) {
      alert('해당 신청자가 없습니다.');
      return;
    }
    Meteor.call('study.rejectApplication', id, applicantId, (error, result) => {
      if (error) {
        console.error('거절 실패:', error);
      } else {
        setApplications((prevApplications) =>
          prevApplications.map((app) => ({
            ...app,
            applicants: app.applicants.filter((applicant) => applicant.userId !== applicantId), // 신청자 제거
          }))
        );
      }
    });
  };

  // 신청자 목록 필터링 처리: 거절된 신청자는 제외
  const filteredApplications = [];
  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    const filteredApplicants = [];

    for (let j = 0; j < app.applicants.length; j++) {
      const applicant = app.applicants[j];
      if (applicant.state !== '거절') {
        filteredApplicants.push(applicant);
      }
    }

    filteredApplications.push({
      ...app,
      applicants: filteredApplicants,
    });
  }
  const handleStartStudy = () => {
   // 수락된 신청자들 필터링 (수락된 신청자만)
   const acceptedApplicants = [];
   for (let i = 0; i < applications.length; i++) {
     const application = applications[i];
     for (let j = 0; j < application.applicants.length; j++) {
       const applicant = application.applicants[j];
       if (applicant.state === '수락') {
         acceptedApplicants.push(applicant);
       }
     }
   }
  
  // 작성자를 제외한 수락된 신청자 수 계산
  const acceptedNonOwnerApplicants = acceptedApplicants.filter(
    (applicant) => applicant.userId !== currentUserNickname
  );
  
  // 작성자를 포함한 전체 참가자 수 계산
  const totalParticipants = acceptedNonOwnerApplicants.length + (studyData.userId === currentUserNickname ? 1 : 0);
  
  // 참가자가 2명 이상이어야 스터디 시작 가능
  if (totalParticipants < 2) {
    alert('2명 이상이어야 스터디를 시작할 수 있습니다.');
    return;
  }
   // 상태 변경을 위한 API 호출
   Meteor.call('study.updateStatus', id, '모집완료', (error) => {
    if (error) {
      console.error('모집 상태 변경 실패:', error);
    } else {
      setStudyData((prevState) => ({
        ...prevState,
        status: '모집완료',
      }));
      alert('스터디가 시작되었습니다!');
      window.location.reload();
    }
  });
};

  if (loading) {
    return <div>로딩 중...</div>;  // 로딩 중 표시
  }

  if (!studyData) {
    return <div>스터디 정보가 없습니다.</div>;
  }

  const handleEndStudy = () => {
    const endDate = new Date();  // 현재 날짜로 마감일 설정
    
    // Application 컬렉션에서 해당 스터디의 신청 상태를 '종료'로 업데이트
    Meteor.call('study.endStudy', id, endDate, (error, result) => {
      if (error) {
        console.error('스터디 종료 처리 실패:', error);
        alert('스터디 종료에 실패했습니다.');
        return;
      }
      else {
        alert('스터디가 종료되었습니다.');
        window.location.reload();  // 페이지 새로 고침
      }
      
      
    });
  };
  
  
  

  const { title, content, address, techStack, studyCount, studyClose, roles, onOffline, rating, views, status, createdAt, userId } = studyData;

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 작성자가 아닌 경우에만 신청 버튼을 보이게
  const isUserOwner = currentUserNickname === userId;

  // 모집 상태가 '모집마감'일 경우 버튼 비활성화 여부
  const isRecruitingClosed = status === '모집마감';

  // 수락된 신청자 수
  const acceptedApplicants = applications.flatMap(app =>
    app.applicants.filter(applicant => applicant.state === '수락')
  );

  const hasOngoingApplications = applications.some(app => 
    app.progress === '진행'  // progress가 '진행'인 경우 체크
  );
  

  return (
    <div className="study-details">
      <h1>스터디 상세 정보</h1>

      <div>
        <strong>제목:</strong> {title}
      </div>

      <div>
        <strong>작성자:</strong> {userId}
      </div>

      <div>
        <strong>등록일:</strong> {formatDate(createdAt)}
      </div>

      {/* 모집 상태가 '모집완료'일 경우, '모집 마감일' 숨기기 */}
      {status !== '모집완료' && (
  <div>
    <strong>모집 마감일:</strong> {formatDate(studyClose)}
  </div>
)}


      <div>
        <strong>모집 상태:</strong> {status}
      </div>

      <div>
        <strong>지역:</strong> {address ? `${address.city} ${address.gubun}` : '정보 없음'}
      </div>

      <div>
        <strong>진행 방식:</strong> {onOffline}
      </div>
      <div>
        <strong>역할:</strong>{roles}
      </div>
      {status !== '모집완료' && (
       
      <div>
        <strong>모집 인원:</strong> {studyCount}
      </div>
    )}
    {status == '모집완료' && (
      <>
      <div>
      <strong>스터디 인원:</strong> {acceptedApplicants.length}
    </div>
    {applications.map((application) => (
  <div key={application.studyId}>
    {/* 신청자와 상관없는 정보 출력 */}
    <div>진행 상태: {application.progress || '정보 없음'}</div>
    <div>시작일: {formatDate(application.startDate) || '정보 없음'}</div>
  </div>
))}
  </>
)}
{applications.some(app => app.progress === '종료') && (
  <div>
    <strong>종료일:</strong> {formatDate(studyData.endDate) || '정보 없음'}
  </div>
)}
      <div>
        <strong>기술 스택:</strong>
        <ul>
          {techStack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>

      <div>
  <strong>평점: </strong>
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          fontSize: '24px',
          color: rating >= star ? '#FFD700' : '#D3D3D3', // Gold for selected, gray for unselected
        }}
      >
        {rating >= star ? '★' : '☆'}
      </span>
    ))}
  </div>
</div>

      <div>
        <strong>내용:</strong> {content}
      </div>

      <div>
        <strong>조회수:</strong> {views}
      </div>
    
      {isUserOwner && hasOngoingApplications && (
        <div>
          <button onClick={handleEndStudy}>스터디 종료</button>
        </div>
      )}
      {/* 모집 상태가 '모집중'일 때만 '스터디 시작' 버튼을 보이게 */}
      {isUserOwner && status === '모집중' && (
        <button onClick={handleStartStudy}>스터디 시작</button>
      )}
      <h3>신청자 목록</h3>
      {!isUserOwner && !applications.some((app) => app.userId === currentUserNickname) && (
        <button onClick={handleApply} disabled={isRecruitingClosed}>신청하기</button>
      )}

      {/* 신청자 목록 (누구나 볼 수 있음) */}
      {filteredApplications.length > 0 && (
  <div>
    {filteredApplications.map((application, index) => {
      
      return (
        <div key={index}>
          {application.applicants
            .filter(applicant => applicant.userId !== userId)  // 작성자를 제외한 신청자만 필터링
            .map((applicant) => {
              
              return (
                <div key={applicant.userId}>
                  <strong>{applicant.nickname || applicant.userId}</strong> - {applicant.state}
                  

                  {isUserOwner && applicant.state === '신청' && (  // 작성자만 수락/거절 버튼을 볼 수 있도록 조건 추가
                    <>
                    
                      <button onClick={() => handleAccept(applicant.userId)} disabled={isRecruitingClosed}>수락</button>
                      <button onClick={() => handleReject(applicant.userId)} disabled={isRecruitingClosed}>거절</button>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      );
    })}
  </div>
)}




      <div>
        <h3>댓글</h3>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 작성해주세요."
        />
        <button onClick={handleCommentSubmit} disabled={isRecruitingClosed}>댓글 작성</button>

        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.nickname}</strong> ({formatDate(comment.createdAt)})
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyDetail;