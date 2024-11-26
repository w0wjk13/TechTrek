import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Study } from '/imports/api/collections';
import { Meteor } from 'meteor/meteor';

const StudyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // URL에서 id를 가져옴
  const [studyData, setStudyData] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // studyData와 username을 비동기적으로 가져오기
    const study = Study.findOne(id);
    if (study) {
      setStudyData(study);

      // 작성자 정보를 Meteor.users에서 가져오기
      const user = Meteor.users.findOne(study.userId);
      const username = user?.profile?.nickname || user?.username || '알 수 없음';
      setUsername(username);
    }
  }, [id]);  // id가 변경될 때마다 실행

  // 주소 포맷 함수
  const formatAddress = (address) => {
    if (typeof address === 'string') {
      return address; // 만약 address가 문자열이라면 그대로 반환
    }
    if (address && address.city && address.gubun) {
      return `${address.city} ${address.gubun}`;
    }
    if (address && address.city) {
      return address.city;
    }
    if (address && address.gubun) {
      return address.gubun;
    }
    return '위치 정보 없음';
  };

  // studyData가 null일 경우 반환하는 컴포넌트
  if (!studyData) {
    return <div>스터디 정보가 없습니다.</div>;
  }

  const { title, content, address, techStack, studyCount, studyClose, roles, onOffline, score, views, status, createdAt } = studyData;

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="study-details">
      <h1>스터디 상세 정보</h1>

      <div>
        <strong>제목:</strong> {title}
      </div>

      <div>
        <strong>작성자:</strong> {username} {/* 작성자 출력 */}
      </div>

      <div>
        <strong>등록일:</strong> {formatDate(createdAt)} {/* 등록일 출력 */}
      </div>

      <div>
        <strong>모집 마감일:</strong> {formatDate(studyClose)}
      </div>

      <div>
      <strong>모집 상태:</strong>{status}
      </div>

      <div>
        <strong>지역:</strong> {formatAddress(address)} {/* 주소 출력 */}
      </div>

      <div>
        <strong>진행 방식:</strong> {onOffline}
      </div>

      <div>
        <strong>모집 인원:</strong> {studyCount}
      </div>

      <div>
        <strong>요구하는 역할:</strong> {roles.join(', ')}
      </div>

      <div>
        <strong>기술 스택:</strong>
        {techStack.length > 0 ? (
          <ul>
            {techStack.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        ) : (
          <p>기술 스택이 없습니다.</p>
        )}
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
          <strong>조회수:</strong>{views}
          </div>
      <button onClick={() => navigate('/')}>스터디 리스트</button>
    </div>
  );
};

export default StudyDetail;
