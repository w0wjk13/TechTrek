import React from "react";
import { useParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

const ReportMember = () => {
  const { memberId } = useParams();

  // const member = useTracker(() => {
  //   return Meteor.Users.findOne({ _id: memberId });
  // });

  return (
    <>
      <h2>{member ? `{member.profile.nickname} 평가하기` : "평가 페이지"}</h2>
    </>
  );
};

export default ReportMember;
