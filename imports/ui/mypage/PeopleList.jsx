import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { StandBy } from "/imports/api/collections";

const PeopleList = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();

  const { user, standByUsers } = useTracker(() => {
    const user = Meteor.user();
    //승인대기 컬렉션에서 특정 studyId에 해당하는 모든 userId를 배열로 가져오기
    const userIds = StandBy.find({ studyId: studyId }).map((doc) => doc.userId);
    //userId와 일치하는 user._id 가져오기
    const standByUsers = Meteor.users.find({ _id: { $in: userIds } }).fetch();

    return { user, standByUsers };
  });
  console.log(standByUsers);

  const goProfile = (userId) => {
    if (!userId) {
      console.error("userId 없음");
      return;
    }
    navigate(`/mypage/${userId}`);
  };

  const approve = (userId) => {
    Meteor.call("approve", userId);
  };

  return (
    <>
      <h2>신청자 목록</h2>
      <ul>
        {standByUsers.map((user) => (
          <li key={user._id}>
            <img
              src={user.profile?.profilePicture}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            {user.profile?.nickname}
            <button onClick={() => goProfile(user._id)}>프로필</button>
            <button onClick={() => approve(user._id)}>승인</button>
            <button>거절</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PeopleList;
