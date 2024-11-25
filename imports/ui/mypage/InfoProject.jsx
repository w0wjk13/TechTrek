import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Study } from "/imports/api/collections";
import "/lib/utils.js";

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

const InfoProject = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { user, study, teamMembers, profilePicture, isLoading } = useTracker(
    () => {
      const user = Meteor.user();
      const study = Study.findOne(studyId);
      let teamMembers = [];

      if (study && study.teamMember) {
        teamMembers = Meteor.users
          .find({ _id: { $in: study.teamMember } })
          .fetch();
      }

      return {
        user: user,
        study: study,
        teamMembers: teamMembers,
        profilePicture: user?.profile?.profilePicture,
        isLoading: !study || !user,
      };
    }
  );

  useEffect(() => {
    console.log("useEffect 호출");
    if (study) {
      Meteor.call("getInfo", study._id, (err, rlt) => {
        if (!err) {
          console.log("getInfo 결과: ", rlt);
          setStatus(rlt.status);
          setStartDate(
            rlt.status === "모집중" ? null : rlt.startDate?.toStringYMD()
          );
          setEndDate(
            rlt.status === "모집중" ? null : rlt.endDate?.toStringYMD()
          );
        } else {
          console.error("getInfo 실패: ", err.reason);
        }
      });
    }
  }, [study?._id]);

  if (isLoading) {
    return <div>로딩 중</div>;
  }

  if (study && status === "") {
    setStatus(study.status);
  }

  if (study === null) {
    return <div>스터디를 찾을 수 없습니다</div>;
  }

  const peopleList = () => {
    navigate(`/mypage/peopleList/${study._id}`);
  };

  const MyWriteStudy = () => {
    navigate(`/study/${study._id}`);
  };

  const saveStatus = () => {
    if (status === "종료" && study.status !== "시작") {
      alert("프로젝트가 시작되지 않아 종료할 수 없습니다");
      return;
    }

    if (status === "모집중") {
      alert("모집마감일을 다시 선택해 주세요");
      navigate(`/study/${study._id}`);
    }

    Meteor.call("updateStatus", studyId, status, (err, rlt) => {
      if (err) {
        console.error("updateStatus 실패: ", err.reason);
      } else {
        setStatus(rlt.status);
        setStartDate(rlt.startDate?.toStringYMD() || null);
        setEndDate(rlt.endDate?.toStringYMD() || null);
        setEditMode(false);
      }
    });
  };

  const cancelEditMode = () => {
    setStatus(study.status);
    setEditMode(false);
  };

  const goReport = (memberId) => {
    navigate(`/mypage/report/${memberId}`);
  };

  return (
    <>
      <li>
        <Link to="/mypage">프로필</Link>
      </li>
      <li>
        <Link to="/mypage/myproject">프로젝트</Link>
      </li>
      <h2>프로젝트 정보</h2>
      프로젝트명:{study.title}
      <br />
      모집글: <button onClick={MyWriteStudy}>확인하기</button>
      <br />
      팀원모집일정:{" "}
      {`${new Date(study.studyClose).toStringYMDdot()} (${formatDDay(
        study.studyClose
      )})`}
      <br />
      프로젝트진행:
      {!editMode ? (
        <>
          {study.status}{" "}
          <button onClick={() => setEditMode(true)}>수정하기</button>
        </>
      ) : (
        <>
          <select
            value={status}
            onChange={(e) => {
              console.log("선택한 상태: ", e.target.value);
              setStatus(e.target.value);
            }}
          >
            <option value="모집중">모집중</option>
            <option value="시작">시작</option>
            <option value="종료">종료</option>
          </select>
          <button onClick={saveStatus}>저장</button>
          <button onClick={cancelEditMode}>취소</button>
        </>
      )}
      <br />
      프로젝트일정:
      {startDate ? `시작 ${startDate}` : "프로젝트 일정이 등록되지 않았습니다"}
      {endDate ? ` 종료 ${endDate}` : ""}
      <br />
      <hr />
      <h3>팀원 정보</h3>
      팀장: {user.profile.nickname} {user.profile.roles}
      <br />
      팀원:
      <ul>
        {teamMembers
          .filter((member) => member._id !== study.userId)
          .map((member) => (
            <li key={member._id}>
              <img
                src={profilePicture}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              {member.profile.nickname} {member.profile.roles}
              {study.status === "종료" && study.endDate && (
                <button onClick={() => goReport(member._id)}>평가하기</button>
              )}
            </li>
          ))}
      </ul>
      <br />
      <button onClick={peopleList}>팀원 추가</button>
    </>
  );
};

export default InfoProject;
