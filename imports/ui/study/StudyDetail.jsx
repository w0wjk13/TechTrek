import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Study, Comment } from '/imports/api/collections';  // 수정된 comment 컬렉션 불러오기

const StudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // URL에서 id를 가져옴
  const [studyData, setStudyData] = useState(null);
  const [username, setUsername] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);

  // 현재 로그인한 사용자 ID
  const currentUserId = Meteor.userId();

  useEffect(() => {
    // studyData와 username을 비동기적으로 가져오기
    const study = Study.findOne(id);
    if (study) {
      setStudyData(study);

      // 작성자 정보를 Meteor.users에서 가져오기
      const user = Meteor.users.findOne(study.userId);
      const username = user?.profile?.nickname || user?.username || '알 수 없음';
      setUsername(username);

      // 해당 스터디의 댓글 정보 가져오기 (comment 컬렉션에서)
      const studyComments = Comment.find({ studyId: id }).fetch();
      setComments(studyComments);
    }

    // 페이지가 로드될 때 조회수 증가
    Meteor.call('study.incrementViews', id, (error, result) => {
      if (error) {
        console.error('조회수 증가 실패:', error);
      } else {
        console.log('조회수 증가 성공');
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
        <strong>지역:</strong> {address}
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

      {!isUserOwner && (
        <button>신청하기</button>
      )}

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

      <button onClick={() => navigate('/')}>스터디 리스트</button>
    </div>
  );
};

export default StudyDetail;
