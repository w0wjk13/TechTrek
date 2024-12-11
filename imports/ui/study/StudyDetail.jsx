import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Study, Comment, Application } from '/imports/api/collections';

const StudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // URL에서 id를 가져옴
  const [studyData, setStudyData] = useState(null);
  const [comments, setComments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');  // 댓글 내용 상태
  const [editingCommentId, setEditingCommentId] = useState(null);  // 현재 수정 중인 댓글의 ID
  const [editedContent, setEditedContent] = useState('');  // 수정된 댓글 내용

  const currentUserNickname = Meteor.user()?.profile?.nickname || '';

  useEffect(() => {
    setLoading(true);

    // 스터디 상세 정보 로드
    Meteor.call('study.getStudyDetails', id, (error, study) => {
      if (error) {
        console.error('스터디 정보 조회 실패:', error);
        setLoading(false);
        return;
      }
      setStudyData(study);

      // 해당 스터디의 댓글 정보 가져오기
      const studyComments = Comment.find({ studyId: id }).fetch();
      setComments(studyComments);

      // 해당 스터디에 신청한 사용자들 가져오기
      const studyApplications = Application.find({ studyId: id }).fetch();
      const applicants = studyApplications.flatMap((app) => 
        app.userIds.map((userId, index) => ({
          userId,
          state: app.states[index],
          nickname: Meteor.users.findOne(userId)?.profile?.nickname || '알 수 없음',
        }))
      );
      setApplications(applicants);
      setLoading(false);
    });
    
    // 조회수 증가
    Meteor.call('study.incrementViews', id, (error) => {
      if (error) console.error('조회수 증가 실패:', error);
    });
  }, [id]);

  const handleApply = () => {
    const isAlreadyApplied = applications.some((applicant) => applicant.userId === currentUserNickname && applicant.state === '신청');
    
    if (isAlreadyApplied) {
      alert('이미 신청한 상태입니다.');
      return;
    }

    Meteor.call('study.apply', id, (error) => {
      if (error) {
        alert('스터디 신청에 실패했습니다. 다시 시도해주세요.');
      } else {
        alert('스터디 신청이 완료되었습니다.');
        setApplications((prevApplications) => [
          ...prevApplications,
          { userId: currentUserNickname, state: '신청', nickname: currentUserNickname },
        ]);
      }
    });
  };

  const handleAccept = (applicantId) => {
    Meteor.call('study.acceptApplication', id, applicantId, (error) => {
      if (error) console.error('수락 실패:', error);
      else {
        setApplications((prevApplications) =>
          prevApplications.map((applicant) =>
            applicant.userId === applicantId ? { ...applicant, state: '수락' } : applicant
          )
        );
      }
    });
  };

  const handleReject = (applicantId) => {
    Meteor.call('study.rejectApplication', id, applicantId, (error) => {
      if (error) {
        console.error('거절 실패:', error);
      } else {
        // 거절한 신청자만 state를 '거절'로 업데이트
        setApplications((prevApplications) =>
          prevApplications.map((applicant) =>
            applicant.userId === applicantId
              ? { ...applicant, state: '거절' }  // 거절된 신청자만 상태 업데이트
              : applicant  // 나머지 신청자는 그대로 둡니다.
          )
        );
      }
    });
  };
  

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleSubmitComment = () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const newComment = {
      studyId: id,
      content: commentContent,
      nickname: currentUserNickname,
      createdAt: new Date(),
    };

    // 댓글을 서버로 전송하여 DB에 저장
    Meteor.call('study.addComment', id, commentContent, (error) => {
      if (error) {
        console.error('댓글 작성 실패:', error);
        alert('댓글 작성에 실패했습니다.');
      } else {
        
        // 댓글 목록에 새 댓글을 추가
        setComments((prevComments) => [newComment, ...prevComments]);
        setCommentContent('');  // 댓글 내용 초기화
      }
    });
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);  // 수정할 댓글의 ID를 설정
    setEditedContent(currentContent);  // 현재 댓글 내용을 설정
  };

  const handleSaveEditedComment = () => {
    if (!editedContent.trim()) {
      alert('수정된 댓글 내용을 입력해주세요.');
      return;
    }

    // 댓글 수정 서버 호출
    Meteor.call('study.updateComment', editingCommentId, editedContent, (error) => {
      if (error) {
        console.error('댓글 수정 실패:', error);
        
      } else {
        
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === editingCommentId ? { ...comment, content: editedContent } : comment
          )
        );
        setEditingCommentId(null);  // 수정 모드 종료
        setEditedContent('');  // 수정된 내용 초기화
      }
    });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('정말로 댓글을 삭제하시겠습니까?')) {
      // 댓글 삭제 서버 호출
      Meteor.call('study.deleteComment', commentId, (error) => {
        if (error) {
          console.error('댓글 삭제 실패:', error);
          alert('댓글 삭제에 실패했습니다.');
        } else {
          alert('댓글이 삭제되었습니다.');
          setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        }
      });
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!studyData) {
    return <div>스터디 정보가 없습니다.</div>;
  }

  const { title, content, studyClose, roles, onOffline, rating, views, status, createdAt, userId } = studyData;

  const isUserOwner = currentUserNickname === userId;
  const isRecruitingClosed = status === '모집마감';

  // 신청자 목록에서 작성자 제외
  const filteredApplications = applications.filter((applicant) => applicant.userId !== userId);

  const acceptedApplicants = filteredApplications.filter((applicant) => applicant.state === '수락');

  return (
    <div className="study-details">
      <h1>스터디 상세 정보</h1>
      <div><strong>제목:</strong> {title}</div>
      <div><strong>작성자:</strong> {userId}</div>
      <div><strong>등록일:</strong> {new Date(createdAt).toLocaleDateString()}</div>
      {status !== '모집완료' && <div><strong>모집 마감일:</strong> {new Date(studyClose).toLocaleDateString()}</div>}
      <div><strong>모집 상태:</strong> {status}</div>
      <div><strong>진행 방식:</strong> {onOffline}</div>
      <div><strong>역할:</strong>{roles}</div>
      {status === '모집완료' && <div><strong>스터디 인원:</strong> {acceptedApplicants.length}</div>}

      <div><strong>기술 스택:</strong>
        <ul>
          {studyData.techStack.map((tech, index) => <li key={index}>{tech}</li>)}
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

      <div><strong>내용:</strong> {content}</div>
      <div><strong>조회수:</strong> {views}</div>

      {!isUserOwner && !applications.some((app) => app.userIds === currentUserNickname) && !isRecruitingClosed && (
        <button onClick={handleApply}>신청하기</button>
      )}

      {filteredApplications.length > 0 && (
        <div>
          <h3>신청자 목록</h3>
          {filteredApplications.filter((applicant) => applicant.state !== '거절').map((applicant) => (
            <div key={applicant.userId}>
              <strong>{applicant.userId}</strong> - {applicant.state}
              {isUserOwner && applicant.state === '신청' && (
                <>
                  <button onClick={() => handleAccept(applicant.userId)}>수락</button>
                  <button onClick={() => handleReject(applicant.userId)}>거절</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <h3>댓글</h3>
      <textarea
        value={commentContent}
        onChange={handleCommentChange}
        placeholder="댓글을 작성해주세요."
      />
      <button onClick={handleSubmitComment}>댓글 작성</button>

      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.nickname}</strong> ({new Date(comment.createdAt).toLocaleString()})
            {editingCommentId === comment._id ? (
              <div>
                {/* 댓글 수정 input 박스 */}
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="수정된 댓글 내용을 입력하세요"
                />
                <button onClick={handleSaveEditedComment}>수정 저장</button>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
            {/* 수정 버튼 */}
            {comment.nickname === currentUserNickname && editingCommentId !== comment._id && (
              <button onClick={() => handleEditComment(comment._id, comment.content)}>수정</button>
            )}
            {/* 삭제 버튼 */}
            {comment.nickname === currentUserNickname && (
              <button onClick={() => handleDeleteComment(comment._id)}>삭제</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudyDetail;
