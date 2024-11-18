import React, { useState, useEffect } from "react";
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
  const [edit, setEdit] = useState(false);

  const user = useTracker(() => Meteor.user());
  console.log("myProfile 유저: ", user);

  useEffect(() => {
    if (user?.profile?.techStack) {
      setStackList(user.profile.techStack);
    }
  }, []);

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

  const toggleEdit = () => {
    setEdit(!edit); //true 기술스택 수정 가능
    if (edit) {
      saveTechStack();
    }
  };

  const saveTechStack = () => {
    Meteor.call("saveTechStack", stackList, (err) => {
      if (err) {
        console.error("saveTechStack 실패: ", err);
      } else {
        console.log("saveTechStack 성공");
      }
    });
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
      자주 사용하는 기술스택을 최대 5개로 설정해 주세요{" "}
      <button onClick={toggleEdit}>{edit ? "완료" : "수정"}</button>
      {edit && (
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
        </div>
      )}
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
      아직 프로젝트에 참여하지 않았어요
      <hr />
      <h3>점수</h3>
    </>
  );
};

export default MyProfile;
