import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 import
import MypageNav from './MypageNav.jsx';

const MypageProject = () => {
  const [myStudies, setMyStudies] = useState([]);  // 내가 생성한 스터디
  const [appliedStudies, setAppliedStudies] = useState([]);  // 내가 신청한 스터디
  const [loading, setLoading] = useState(true);

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

        setMyStudies(studies);  // 생성한 스터디 데이터를 상태에 설정
      } catch (error) {
        console.error('생성한 스터디를 가져오는 데 실패했습니다:', error.message);
      }
    };

    // 현재 사용자가 신청한 스터디 목록을 가져오는 함수
    const fetchAppliedStudies = async () => {
      try {
        // 서버 메서드 호출하여 사용자 신청 스터디 목록 가져오기
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getAppliedStudies', (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });

        // 내가 생성한 스터디를 신청한 스터디 목록에서 제외
        const filteredStudies = studies.filter(study => study.creatorName !== currentUserId);

        setAppliedStudies(filteredStudies);  // 신청한 스터디 데이터를 상태에 설정
        setLoading(false);  // 로딩 상태 해제
      } catch (error) {
        console.error('신청한 스터디를 가져오는 데 실패했습니다:', error.message);
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchMyStudies();  // 생성한 스터디 목록 가져오기
      fetchAppliedStudies();  // 신청한 스터디 목록 가져오기
    }
  }, [currentUserId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage-container">
      <div className="mypage-nav">
        <MypageNav />
      </div>
      <div className="mypage-content">
        {/* 내가 생성한 스터디 목록 */}
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
                  <strong>작성자:</strong> {study.creatorName} {/* 작성자 표시 */}
                </div>
                <div>
                  <strong>등록일:</strong> {new Date(study.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>모집 마감일:</strong> {new Date(study.studyClose).toLocaleDateString()}
                </div>
                <div>
                  <strong>모집 상태:</strong> {study.status}
                </div>
                <div>
                  <strong>모집 인원:</strong> {study.studyCount}
                </div>
                <div>
                  <strong>신청자:</strong> {study.applicantCount} {/* 신청자 수 표시 */}
                </div>
                <div>
                  <strong>진행 상태:</strong> {study.progress} {/* 진행 상태 출력 */}
                </div>
                <div>
                  <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()} {/* 진행일 출력 */}
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
            ))}
          </ul>
        )}

        {/* 내가 신청한 스터디 목록 */}
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
                  <strong>작성자:</strong> {study.userId} {/* 작성자 표시 */}
                </div>
                <div>
                  <strong>등록일:</strong> {new Date(study.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>모집 마감일:</strong> {new Date(study.studyClose).toLocaleDateString()}
                </div>
                <div>
                  <strong>모집 상태:</strong> {study.status}
                </div>
                <div>
                  <strong>모집 인원:</strong> {study.studyCount}
                </div>
                <div>
                  <strong>신청자:</strong> {study.applicantCount} {/* 신청자 수 표시 */}
                </div>
                <div>
                  <strong>진행 상태:</strong> {study.progress} {/* 진행 상태 출력 */}
                </div>
                <div>
                  <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()} {/* 진행일 출력 */}
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MypageProject;
