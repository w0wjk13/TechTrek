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

  const numberPeopleRef = useRef(null); //모집인원
  const [stackList, setStackList] = useState([]); //선택한 기술스택 목록
  const [date, setDate] = useState(null); //모집마감일
  const [studyType, setStudyType] = useState("offline"); //오프라인일 경우 주소입력창 보여주기
  const addressRef = useRef(null); //주소
  const formRef = useRef(null); //백엔드프론트 온라인오프라인
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [score, setScore] = useState({}); //요구하는 역량과 점수

  const gifts = ["manner", "mentoring", "passion", "communication", "time"]; //역량 종류

  const addStack = (e) => {
    const selectStack = e.target.value;
    //사용자가 스택을 선택했고 && useState([])에 사용자가 선택한 스택이 없다면 추가(최대 5개 스택)
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const uploadData = {
      roles: formData.get("studyType"), //모집분야(프론트/백)
      onOffline: studyType, //모집형태(온/오프라인)
      //주소
      address:
        formData.get("studyType") === "offline"
          ? addressRef.current.value
          : null,
      studyCount: numberPeopleRef.current.value, //모집인원
      techStack: stackList, //기술스택
      studyClose: date,
      title: titleRef.current.value,
      content: contentRef.current.value,
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
      <form onSubmit={handleSubmit} ref={formRef}>
        <h3>모집 분야</h3>
        <div>
          <div>
            <input
              type="radio"
              id="all"
              name="roles"
              value="전체"
              defaultChecked
            />
            <label htmlFor="all">전체</label>
          </div>
          <div>
            <input type="radio" id="frontend" name="roles" value="프론트엔드" />
            <label htmlFor="frontend">프론트엔드</label>
          </div>
          <div>
            <input type="radio" id="backend" name="roles" value="백엔드" />
            <label htmlFor="backend">백엔드</label>
          </div>
        </div>

        <h3>모임 형태</h3>
        <div>
          <div>
            <input
              type="radio"
              id="online"
              name="studyType"
              value="online"
              onChange={(e) => setStudyType(e.target.value)}
            />
            <label htmlFor="online">온라인</label>
          </div>

          <div>
            <input
              type="radio"
              id="offline"
              name="studyType"
              value="offline"
              onChange={(e) => setStudyType(e.target.value)}
            />
            <label htmlFor="offline">오프라인</label>
          </div>

          {studyType === "offline" && (
            <>
              <input type="text" placeholder="주소 입력하기" ref={addressRef} />
            </>
          )}
          <br />
        </div>

        <select ref={numberPeopleRef} defaultValue="모집인원">
          <option value="모집인원" disabled>
            모집인원
          </option>
          {Array.from({ length: 9 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}명
            </option>
          ))}
        </select>
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
          <br />
        </div>

        <DatePicker
          locale={ko}
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy년 MM월 dd일"
          placeholderText="모집마감일"
        />
        <br />

        <div>
          {gifts.map((gift) => (
            <div key={}></div>
          ))}
        </div>

        <div>
          <input type="text" ref={titleRef} placeholder="제목을 입력하세요" />
          <br />
          <textarea
            style={{ width: "500px", height: "100px" }}
            ref={contentRef}
            placeholder="프로젝트에 대해 설명해 주세요"
          />
        </div>
        <button type="submit">제출하기</button>
      </form>
    </>
  );
};

export default UploadStudy;
