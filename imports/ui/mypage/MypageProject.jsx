import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom'; 
import MypageNav from './MypageNav.jsx';

const MypageProject = () => {
  const [myStudies, setMyStudies] = useState([]);  // Created studies
  const [appliedStudies, setAppliedStudies] = useState([]);  // Applied studies
  const [loading, setLoading] = useState(true);

  // Current logged-in user ID
  const currentUserId = Meteor.userId();

  // Navigate hook for routing
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyStudies = async () => {
      setLoading(true);
      try {
        // Fetch studies created by the user
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getMyStudies', (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        setMyStudies(studies);
      } catch (error) {
        console.error('Failed to fetch created studies:', error.message);
      }
    };

    const fetchAppliedStudies = async () => {
      try {
        // Fetch studies the user has applied to
        const studies = await new Promise((resolve, reject) => {
          Meteor.call('study.getAppliedStudies', (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        setAppliedStudies(studies);
      } catch (error) {
        console.error('Failed to fetch applied studies:', error.message);
      }
    };

    if (currentUserId) {
      fetchMyStudies();
      fetchAppliedStudies();
    }
    setLoading(false);
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
        {/* Created Studies */}
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
                  <strong>작성자:</strong> {study.userId}
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
                  <strong>신청자:</strong> {study.applicantCount}
                </div>
                <div>
                  <strong>진행 상태:</strong> {study.progress}
                </div>
                <div>
                  <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
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

        {/* Applied Studies */}
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
                  <strong>작성자:</strong> {study.userId}
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
                  <strong>신청자:</strong> {study.applicantCount}
                </div>
                <div>
                  <strong>진행 상태:</strong> {study.progress}
                </div>
                <div>
                  <strong>진행일:</strong> {study.startDate === '미정' ? '날짜 미정' : new Date(study.startDate).toLocaleDateString()}
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
