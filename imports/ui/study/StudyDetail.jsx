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
  const currentUserId = Meteor.userId();

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
      setApplications(studyApplications);

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
            userId: currentUserId,
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
    // 이미 신청한 경우 처리
    if (applications.some((app) => app.userId === currentUserId)) {
      alert('이미 신청한 상태입니다.');
      return;
    }

    Meteor.call('study.apply', id, (error, result) => {
      if (error) {
        console.error('스터디 신청 실패:', error);
      } else {
        // 신청 후 UI에 반영
        setApplications((prevApplications) => [
          ...prevApplications,
          { userId: currentUserId, state: '신청됨' },  // state로 변경
        ]);
      }
    });
  };

  // 신청 상태 수락 처리
  const handleAccept = (applicantId) => {
    Meteor.call('study.acceptApplication', id, applicantId, (error, result) => {
      if (error) {
        console.error('수락 실패:', error);
      } else {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.userId === applicantId ? { ...app, state: '수락됨' } : app  // state로 변경
          )
        );
      }
    });
  };

  // 신청 상태 거절 처리
  const handleReject = (applicantId) => {
    Meteor.call('study.rejectApplication', id, applicantId, (error, result) => {
      if (error) {
        console.error('거절 실패:', error);
      } else {
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.userId !== applicantId)
        );
      }
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;  // 로딩 중 표시
  }

  if (!studyData) {
    return <div>스터디 정보가 없습니다.</div>;
  }

  const { title, content, address, techStack, studyCount, studyClose, roles, onOffline, score, views, status, createdAt, userId } = studyData;

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 작성자가 아닌 경우에만 신청 버튼을 보이게
  const isUserOwner = currentUserId === userId;

  return (
    <div className="study-details">
      <h1>스터디 상세 정보</h1>

      <div>
        <strong>제목:</strong> {title}
      </div>

      <div>
        <strong>작성자:</strong> {username}
      </div>

      <div>
        <strong>등록일:</strong> {formatDate(createdAt)}
      </div>

      <div>
        <strong>모집 마감일:</strong> {formatDate(studyClose)}
      </div>

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
        <strong>모집 인원:</strong> {studyCount}
      </div>

      <div>
        <strong>기술 스택:</strong>
        <ul>
          {techStack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>점수:</strong>
        <ul>
          {Object.keys(score).map((key) => (
            <li key={key}>
              {key}: {score[key]}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <strong>내용:</strong> {content}
      </div>

      <div>
        <strong>조회수:</strong> {views}
      </div>

      {!isUserOwner && !applications.some((app) => app.userId === currentUserId) && (
        <button onClick={handleApply}>신청하기</button>
      )}

      {/* 신청자 목록 (작성자만 볼 수 있음) */}
      {isUserOwner && (
        <div>
          <h3>신청자 목록</h3>
          {applications.length === 0 ? (
            <p>신청자가 없습니다.</p>
          ) : (
            <ul>
              {applications.map((app) => (
                <li key={app.userId}>
                  {app.state === '신청됨' && (  // state 사용
                    <div>
                      <strong>{Meteor.users.findOne(app.userId)?.profile?.nickname || '알 수 없음'}</strong>님이 신청했습니다.
                      <button onClick={() => handleAccept(app.userId)}>수락</button>
                      <button onClick={() => handleReject(app.userId)}>거절</button>
                    </div>
                  )}
                  {app.state === '수락됨' && <p>수락됨</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 스터디 리스트 버튼을 댓글 섹션 위로 이동 */}
      <button onClick={() => navigate('/')}>스터디 리스트</button>

      <div>
        <h3>댓글</h3>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 작성해주세요."
        />
        <button onClick={handleCommentSubmit}>댓글 작성</button>

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
