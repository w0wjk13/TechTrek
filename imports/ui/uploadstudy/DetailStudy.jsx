import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Study } from "/imports/api/collections";
import "/lib/utils.js";

//작성일 표시 형식
const formatCreatedAt = (createdAt) => {
  const now = new Date();
  const diffMs = now - createdAt; //밀리초 단위로 계산
  const diffMin = Math.floor(diffMs / 60000); //분 단위로 변환
  const diffHour = Math.floor(diffMs / 360000); //시 단위로 변환
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const yesterday = now.addDates(-1);
  const twoDaysAgo = now.addDates(-2);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (createdAt.toStringYMD() === yesterday.toStringYMD()) return "어제";
  if (createdAt.toStringYMD() === twoDaysAgo.toStringYMD()) return "2일 전";
  if (diffDay < 7) return `${diffDay}일 전`;
  if (createdAt.getFullYear() === now.getFullYear()) {
    return createdAt.toStringMD();
  }
  return createdAt.toStringYMD();
};

//모집마감일 표시 형식
const formatDDay = (studyClose) => {
  const today = new Date();
  const closeDay = new Date(studyClose);

  const timeDiff = closeDay.getTime() - today.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (dayDiff > 0) {
    return `D-${dayDiff}`;
  } else if (dayDiff === 0) {
    return "오늘 마감";
  } else {
    return "마감";
  }
};

const DetailStudy = () => {
  const { id } = useParams(); //insert id
  const navigate = useNavigate();
  const [cancel, setCancel] = useState(false);

  const { study, username, profilePicture, teamMembers, isLoading } =
    useTracker(() => {
      const study = Study.findOne(id);
      const writer = study ? Meteor.users.findOne(study.userId) : null; //글 작성자 가져오기
      let teamMembers = [];

      if (study && study.teamMember) {
        teamMembers = Meteor.users
          .find({ _id: { $in: study.teamMember } })
          .fetch();
      }

      return {
        study: study,
        username: writer?.profile?.nickname,
        profilePicture: writer?.profile?.profilePicture,
        teamMembers: teamMembers,
        isLoading: !study || !study.teamMember,
      };
    });

  const isWriter = study?.userId === Meteor.userId(); //작성자

  useEffect(() => {
    if (study && study._id) {
      Meteor.call("alreadyRequest", study._id, (err, rlt) => {
        if (err) {
          console.error("alreadyRequest 실패: ", err);
        } else {
          setCancel(rlt);
        }
      });
    }
  }, [study]);

  useEffect(() => {
    if (id) {
      Meteor.call("viewCount", id, (err) => {
        if (err) {
          console.error("viewCount 실패: ", err);
        }
      });
    }
  }, []);

  if (isLoading || !study || !study.teamMember) {
    return <div>로딩 중</div>;
  }

  const goMain = () => {
    navigate("/");
  };

  const joinRequest = () => {
    if (cancel) {
      Meteor.call("cancelRequest", study._id, (err, rlt) => {
        if (err) {
          console.error("cancelRequest 실패: ", err);
        } else {
          alert("참여 신청이 취소되었습니다");
          setCancel(false);
        }
      });
    } else {
      const scoreData = {
        userScore: Meteor.user().profile.score,
        studyScore: study.score,
        studyId: study._id,
      };

      Meteor.call("approveReject", scoreData, (err, rlt) => {
        if (err) {
          alert(err.reason);
        } else {
          if (rlt) {
            alert("참여 요청이 전송되었습니다");
            setCancel(true);
          } else {
            alert("작성자가 요구하는 역량보다 부족합니다");
          }
        }
      });
    }
  };

  const editUploadStudy = () => {
    navigate(`/uploadstudy/${study._id}`);
  };

  const deleteUploadStudy = () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      Meteor.call("delete", id, (err) => {
        if (err) {
          alert(err.reason);
          console.error("delete 실패: ", err);
        } else {
          alert("작성글이 삭제되었습니다");
          navigate("/");
        }
      });
    }
  };

  return (
    <>
      <h2>모집 상세페이지</h2>
      <h3>제목 : {study?.title}</h3>
      <img
        src={profilePicture}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
      작성자 : {username}
      <br />
      작성일 : {formatCreatedAt(new Date(study.createdAt))}
      <br />
      조회수 {study.views || 0}
      <br />
      프로젝트 진행 : {study.status}
      <hr />
      모집분야 : {study.roles}
      <br />
      모임형태 : {study.onOffline}
      {study.onOffline !== "온라인" && (
        <>
          {" "}
          {study.address.city && study.address.gubun
            ? `${study.address.city} ${study.address.gubun}`
            : study.address.city}
        </>
      )}
      <br />
      모집인원 : {study.studyCount}
      <br />
      모집마감일{" "}
      {`${new Date(study.studyClose).toStringYMDdot()} (${formatDDay(
        study.studyClose
      )})`}
      <br />
      기술스택 : {study.techStack.join(" ")}
      <br />
      요구 역량{" "}
      {study?.score &&
        Object.keys(study.score).map((key) => (
          <div key={key} style={{ marginBottom: "5px" }}>
            {key}: {study.score[key]}
          </div>
        ))}
      <hr />
      내용 : {study.content}
      <hr />
      프로젝트 참여자 목록{" "}
      {teamMembers.map((member) => (
        <li key={member._id}>{member.profile.nickname}</li>
      ))}
      <br />
      <button onClick={goMain}>목록</button>
      {isWriter && (
        <>
          <button onClick={editUploadStudy}>수정</button>
          <button onClick={deleteUploadStudy}>삭제</button>
        </>
      )}
      {!isWriter && (
        <button onClick={joinRequest}>
          {cancel ? "참여 취소하기" : "참여하기"}
        </button>
      )}
    </>
  );
};

export default DetailStudy;
