import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Study } from "/imports/api/collections";

const MyProject = () => {
  const navigate = useNavigate();
  const { user, createStudy } = useTracker(() => {
    const user = Meteor.user();
    const createStudy = Study.find({ userId: user._id }).fetch();
    return { user, createStudy };
  });

  const goMain = () => {
    navigate("/");
  };

  return (
    <div>
      <li>
        <Link to="/mypage">프로필</Link>
      </li>
      <li>
        <Link to="/mypage/myproject">프로젝트</Link>
      </li>
      <h2>내 프로젝트</h2>
      <h3>참여한 프로젝트</h3>
      아직 참여한 프로젝트가 없어요. 프로젝트 공고를 확인해 보세요.
      <button onClick={goMain}>프로젝트 보러가기</button>
      <hr />
      <h3>생성한 프로젝트</h3>
      프로젝트 진행:
      <br />
      프로젝트 정보:
      <br />
    </div>
  );
};

export default MyProject;
