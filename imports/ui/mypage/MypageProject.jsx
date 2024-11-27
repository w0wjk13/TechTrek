import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import
import MypageNav from './MypageNav.jsx';

const MypageProject = () => {
  const [myStudies, setMyStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);  // 사용자 정보를 저장할 상태 변수 추가

  // 현재 로그인한 사용자 ID
  const currentUserId = Meteor.userId();

  // 페이지 이동을 위한 navigate 훅
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 사용자가 생성한 스터디 목록을 가져오는 함수
    const fetchMyStudies = async () => {
      setLoading(true); // 로딩 상태 true로 설정

      try {
        // 서버 메서드 호출하여 사용자 생성 스터디 목록 가져오기
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getMyStudies', (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });

        setMyStudies(studies);  // 스터디 데이터를 상태에 설정
        setLoading(false);  // 로딩 상태 해제
      } catch (error) {
        console.error('생성한 스터디를 가져오는 데 실패했습니다:', error.message);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      // 모든 사용자 정보를 가져오는 함수
      const allUsers = await new Promise((resolve, reject) => {
        Meteor.call('getAllUsers', (error, result) => { // getAllUsers 메서드로 모든 사용자 정보 가져오기
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      setUsers(allUsers); // 사용자 정보 설정
    };

    if (currentUserId) {
      fetchMyStudies();
      fetchUsers();
    }
  }, [currentUserId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (myStudies.length === 0) {
    return <div>생성한 스터디가 없습니다.</div>;
  }

  return (
    <div className="mypage-container">
      <div className="mypage-nav">
        <MypageNav />
      </div>
      <div className="mypage-content">
        <h1>내가 생성한 스터디</h1>
        <ul>
          {myStudies.map((study) => {
            // study.userId를 통해 해당 작성자 찾기
            const creator = users.find(user => user._id === study.userId);  // 작성자 정보 찾기
            
            // 생성자 이름 찾기
            const creatorName = creator ? creator.profile.name : '알 수 없음';  // 작성자 이름 설정

            console.log("study.userId: ", study.userId);  // 디버깅을 위한 로그
            console.log("creator._id: ", creator ? creator._id : null);  // 디버깅을 위한 로그

            return (
              <li key={study._id}>
                <div>
                  <strong>제목:</strong> {study.title}
                </div>
                <div>
                  <strong>작성자:</strong> {study.creatorName}
                </div>
                <div>
                  <strong>등록일:</strong> {new Date(study.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>모집 마감일:</strong> {new Date(study.studyClose).toLocaleDateString()}
                </div>
                <div>
                  <strong>기술 스택:</strong>
                  <ul>
                    {study.techStack.map((tech, index) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <button onClick={() => navigate(`/study/detail/${study._id}`)}>상세보기</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MypageProject;
