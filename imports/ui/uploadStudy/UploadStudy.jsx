import React, { useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

const UploadStudy = () => {
  const stackOptions = [
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

  const onOfflineRef = useRef(null);
  const numberPeopleRef = useRef(null);
  const [stackList, setStackList] = useState([]); //선택한 기술스택 목록
  const [date, setDate] = useState(null);

  const addressMap = () => {};

  const addStack = (e) => {
    const selectStack = e.target.value;
    //사용자가 스택을 선택했고 && useState([])에 사용자가 선택한 스택이 없다면 추가
    if (selectStack && !stackList.includes(selectStack)) {
      setStackList([...stackList, selectStack]);
    }
  };

  const removeStack = (stack) => {
    setStackList(stackList.filter((item) => item !== stack));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const uploadData = {
      onOffline: onOfflineRef.current.value,
      numberPeopleRef: numberPeopleRef.current.value,
      stackList: stackList,
      date: date,
    };

    Meteor.call("uploadStudy", uploadData, (err) => {
      if (err) {
        console.error("uploadStudy call 실패: ", err);
      } else {
        console.log("uploadStudy call 성공");
      }
    });
  };

  return (
    <>
      <h2>스터디 생성 페이지</h2>
      <form onSubmit={handleSubmit}>
        <select ref={onOfflineRef} defaultValue="offline">
          <option value="online">온라인</option>
          <option value="offline">오프라인</option>
        </select>
        <br />

        <select ref={numberPeopleRef} defaultValue="1">
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
        <br />

        <div className="stackContainer">
          <select onChange={addStack} defaultValue="">
            <option value="" disabled>
              기술스택
            </option>
            {stackOptions.map((stack, index) => (
              <option key={index} value={stack}>
                {stack}
              </option>
            ))}
          </select>
          <br />

          <div className="selectStackList">
            {stackList.map((stack, index) => (
              <span key={index} className="tag">
                {stack}
                <button type="button" onClick={() => removeStack(stack)}>
                  X
                </button>
              </span>
            ))}
          </div>
        </div>

        <DatePicker
          locale={ko}
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy년 MM월 dd일"
          placeholderText="모집마감일"
        />
        <br />

        <a href="#" onClick={addressMap}>
          주소 선택
        </a>
        <br />

        <button type="submit">제출하기</button>

        <style jsx>{`
          .stackContainer {
            display: flex;
            align-items: center;
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 5px;
            justify-content: flex-start;
          }

          .selectStackList {
            display: flex;
            flex-wrap: wrap;
            margin-left: 10px;
            justify-content: flex-start;
          }

          .tag {
            background-color: #e0e0e0;
            padding: 5px;
            margin-right: 5px;
            border-radius: 3px;
            display: flex;
            align-items: center;
          }

          .tag button {
            margin-left: 5px;
            background-color: transparent;
            border: none;
            cursor: pointer;
          }

          select {
            margin-left: 0;
          }
        `}</style>
      </form>
    </>
  );
};

export default UploadStudy;
