import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Study } from "/imports/api/collections";

const InfoProject = () => {
  const { studyId } = useParams();
  const { study, isLoading } = useTracker(() => {
    const study = Study.findOne(studyId);

    return {
      study: study,
      isLoading: study === undefined,
    };
  });

  if (isLoading) {
    return <div>로딩 중</div>;
  }
  if (study === null) {
    return <div>스터디를 찾을 수 없습니다</div>;
  }

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
      모집글: <br />
      팀원모집일정: <br />
      프로젝트진행: <br />
      프로젝트일정:
      <br />
      <hr />
      <h3>팀원 정보</h3>
      팀장: <br />
      팀원:
      <br />
      <button>팀원 추가</button>
    </>
  );
};

export default InfoProject;
