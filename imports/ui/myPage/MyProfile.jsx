import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

const MyProfile = () => {
  const stackOptions = [
    //기술스택 목록
    "Java",
    "NodeJS",
    "Kotlin",
    "Mysql",
    "MongoDB",
    "Python",
    "Oracle",
    "AWS",
    "Spring",
    "Azure",
    "NextJS",
    "Kubernetes",
    "Javascript",
    "Flutter",
    "Docker",
    "Typescript",
    "Swift",
    "Django",
    "React",
    "ReactNative",
  ];

  const [stackList, setStackList] = useState([]);

  const user = useTracker(() => Meteor.user());
  console.log("myProfile 유저: ", user);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  const addStack = (e) => {
    const selectStack = e.target.value;

    if (
      selectStack &&
      !stackList.includes(selectStack) &&
      stackList.length < 5
    ) {
      setStackList([...stackList, selectStack]);
    }
  };

  const removeStack = (stack) => {
    setStackList(stackList.filter((item) => item !== stack));
  };

  return (
    <>
      <h2>내 프로필</h2>
      {user.profile && user.profile.profilePicture && (
        <img
          src={user.profile.profilePicture}
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      )}
      닉네임 : {user.profile.nickname}
      <br />
      이메일 : {user.emails[0].address}
      <br />
      <button>프로필 편집</button>
      <hr />
      <h3>기술스택</h3>
      자주 사용하는 기술스택을 최대 5개로 설정해 주세요
      <br />
      <div>
        <select
          onChange={addStack}
          defaultValue=""
          disabled={stackList.length >= 5}
        >
          <option value="" disabled>
            기술스택 (최대 5개)
          </option>
          {stackOptions.map((stack, index) => (
            <option key={index} value={stack}>
              {stack}
            </option>
          ))}
        </select>
        <br />

        {stackList.map((stack, index) => (
          <span key={index}>
            {stack}
            <button type="button" onClick={() => removeStack(stack)}>
              X
            </button>
          </span>
        ))}
        <hr />
        <h3>프로젝트 참여 이력</h3>
      </div>
    </>
  );
};

export default MyProfile;
