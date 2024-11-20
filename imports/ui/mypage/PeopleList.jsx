import React from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { StandBy } from "/imports/api/collections";

const PeopleList = () => {
  const { studyId } = useParams();

  const { user } = useTracker(() => {
    const user = Meteor.user();
    //승인대기 컬렉션에서 studyId에 해당하는 모든 문서 가져오기
    const userIds = StandBy.find({ studyId: studyId }).fetch();
    const standByUsers = 

    return user;
  });

  return (
    <>
      <h2>신청자 목록</h2>
      프로필:{" "}
      <img
        src={user.profile.profilePicture}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
    </>
  );
};

export default PeopleList;
