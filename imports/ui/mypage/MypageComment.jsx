import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import MypageNav from './MypageNav.jsx';

const MypageComment = () => {
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState([]); // 체크된 댓글 상태
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태

  const navigate = useNavigate(); // navigate 훅 사용

  // Get the current logged-in user's nickname or username
  const currentUserNickname = Meteor.user()?.profile?.nickname || '';

  useEffect(() => {
    // Fetch the comments made by the current user
    setLoading(true);
    Meteor.call('comment.getUserComments', currentUserNickname, async (error, result) => {
      if (error) {
        console.error('댓글 가져오기 실패:', error);
        setLoading(false);
      } else {
        // 댓글에 스터디 제목 추가
        const commentsWithStudyInfo = await Promise.all(result.map(async (comment) => {
          // 비동기적으로 studyId를 통해 스터디 정보를 가져옴
          const study = await new Promise((resolve, reject) => {
            Meteor.call('study.getStudyDetails', comment.studyId, (error, studyDetails) => {
              if (error) {
                reject(error);
              } else {
                resolve(studyDetails);
              }
            });
          });

          // 스터디 제목 추가
          return {
            ...comment,
            studyName: study?.title || '스터디 정보 없음', // 스터디 제목 (없으면 기본 메시지)
            studyId: study?._id // studyId도 추가
          };
        }));

        // 댓글을 작성 날짜가 오래된 순으로 정렬
        const sortedComments = commentsWithStudyInfo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUserComments(sortedComments);
        setLoading(false);
      }
    });
  }, [currentUserNickname]); // Re-run when the currentUserNickname changes

  // 댓글 선택 처리
  const handleCommentSelect = (commentId) => {
    setSelectedComments((prevSelected) => {
      if (prevSelected.includes(commentId)) {
        // 이미 선택된 댓글이면 제거
        return prevSelected.filter(id => id !== commentId);
      } else {
        // 선택되지 않은 댓글이면 추가
        return [...prevSelected, commentId];
      }
    });
  };

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (selectAll) {
      // 전체 선택 해제
      setSelectedComments([]);
    } else {
      // 전체 선택
      setSelectedComments(userComments.map(comment => comment._id));
    }
    setSelectAll(!selectAll);
  };

  // 선택된 댓글 삭제 처리
  const handleDeleteSelected = () => {
    if (selectedComments.length === 0) {
      alert('삭제할 댓글을 선택해주세요!');
      return;
    }

    // 선택된 댓글을 삭제
    selectedComments.forEach((commentId) => {
      Meteor.call('comment.deleteComment', commentId, (error) => {
        if (error) {
          console.error('댓글 삭제 실패:', error);
        } else {
          // 삭제된 댓글을 목록에서 제거하여 UI 갱신
          setUserComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        }
      });
    });

    // 삭제 후 선택 상태 초기화
    setSelectedComments([]);
    setSelectAll(false); // 전체 선택 해제
  };

  // 스터디 제목 클릭 시 상세 페이지로 이동
  const handleStudyClick = (studyId) => {
    navigate(`/study/detail/${studyId}`);
  };



  return (
   
    <div className="mycmt--comments-nav">
       <MypageNav />
       <div className="mycmt--comments">
      <div className="mycmt--comments-header">{currentUserNickname}님의 댓글</div>
      
     
        {/* 댓글 개수 출력 */}
       
        {userComments.length === 0 ? (
          <div className="mycmt-no-comments">
            <p>받은 평가가 없습니다.</p> {/* 댓글이 없을 때 보여줄 메시지 */}
          </div>
        ) : (
          <>
   <div className="mycmt-comment-count">총 댓글 수: {userComments.length}</div>
      <table className="mycmt-comments-table">
        <thead>
          <tr>
           
            <th>번호</th>
            <th>스터디</th>
            <th>댓글 내용</th>
            <th>작성 날짜</th>
            
            <th>
              {/* 전체 선택 체크박스 */}
              <input
                type="checkbox"
                checked={selectAll} // 전체 선택 여부에 따라 체크 상태 설정
                onChange={handleSelectAll} className="mycmt-select-all-checkbox"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {userComments.map((comment, index) => (
            <tr key={comment._id}>
              
              <td>{index + 1}</td>  {/* 순위 표시 (1, 2, 3, ...) */}
              <td>
                <span className="mycmt-study-title"
                  style={{ color: 'blue', cursor: 'pointer' }} 
                  onClick={() => handleStudyClick(comment.studyId)} // 스터디 제목 클릭 시 이동
                >
                 <div className='mycmt-study-name'> {comment.studyName || '알 수 없음'}</div>
                </span>
              </td>  {/* 스터디 제목 */}
              <td>{comment.content}</td>  {/* 댓글 내용 */}
              <td>{new Date(comment.createdAt).toLocaleString()}</td>  {/* 댓글 작성 날짜 */}
              <td>
                <input
                  type="checkbox"
                  checked={selectedComments.includes(comment._id)} // 체크 상태
                  onChange={() => handleCommentSelect(comment._id)} // 선택 토글
                   className="mycmt-comment-checkbox"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDeleteSelected} className="mycmt-delete-button">삭제하기</button>
      </>
        )}

    </div>
    </div>
  );
};

export default MypageComment;
