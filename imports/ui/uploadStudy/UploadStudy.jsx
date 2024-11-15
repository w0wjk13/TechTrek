import React, { useRef, useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "/lib/utils";

const UploadStudy = () => {
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

  const gifts = ["manner", "mentoring", "passion", "communication", "time"]; //역량 종류

  const regions = [
    //지역 목록
    "서울",
    "경기",
    "인천",
    "대구",
    "대전",
    "세종",
    "경남",
    "전남",
    "충남",
    "제주",
    "부산",
    "광주",
    "울산",
    "강원",
    "경북",
    "전북",
    "충북",
  ];

  const [stackList, setStackList] = useState([]); //선택한 기술스택 목록
  const [date, setDate] = useState(null); //모집마감일
  const [studyType, setStudyType] = useState("offline"); //오프라인일 경우 주소입력창 보여주기
  const [giftScore, setGiftScore] = useState({}); //요구하는 역량과 점수
  const formRef = useRef(null); //백엔드프론트 온라인오프라인
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
    const loginUser = users.random();
    console.log("user: ", loginUser);

    if (loginUser) {
      Meteor.loginWithPassword(loginUser.username, "1234", (err) => {
        if (err) {
          console.error("login error: ", err);
        } else {
          console.log("로그인 유저: ", loginUser.username);
        }
      });
    }
  }, []);

  //체크박스를 클릭하면 추가/해제
  const toggleCheckbox = (gift) => {
    setGiftScore((prevGiftScore) => {
      const newGiftScore = { ...prevGiftScore }; //현재 체크 돼있는 역량
      if (gift in newGiftScore) {
        //사용자가 클릭한 항목이 현재 체크 돼있다면 삭제
        delete newGiftScore[gift];
      } else {
        //사용자가 클릭한 항목이 체크돼 있지 않다면 1점으로 추가
        newGiftScore[gift] = 1;
      }
      return newGiftScore;
    });
  };

  const addScore = (gift, score) => {
    setGiftScore((prevGiftScore) => ({
      ...prevGiftScore,
      [gift]: parseInt(score),
    }));
  };

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

    if (Meteor.userId()) {
      console.log(Meteor.userId());
      const uploadData = {
        roles: formData.get("roles"), //모집분야(프론트/백)
        onOffline: studyType, //모집형태(온/오프라인)
        location: formData.get("location"),
        studyCount: formData.get("studyCount"), //모집인원
        techStack: stackList, //기술스택
        studyClose: date,
        score: giftScore,
        title: titleRef.current.value,
        content: contentRef.current.value,
      };

      Meteor.call("insert", uploadData, (err, rlt) => {
        if (err) {
          console.error("insert 실패: ", err.reason);
          alert(err.reason);
        } else if (rlt.success) {
          console.log("uploadStudy insert call 성공");
        }
      });
    } else {
      console.error("유저가 로그인하지 않았음");
    }
  };

  return (
    <>
      <h2>스터디 모집페이지</h2>
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
              defaultChecked
            />
            <label htmlFor="offline">오프라인</label>
          </div>

          {studyType === "offline" && (
            <>
              <select name="location" defaultValue="">
                <option value="" disabled>
                  지역 선택
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </>
          )}
          <br />
        </div>

        <select name="studyCount" defaultValue="">
          <option value="" disabled>
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
          minDate={new Date()}
        />
        <br />

        <div>
          {gifts.map((gift) => (
            <div key={gift}>
              <input
                type="checkbox"
                id={gift}
                checked={gift in giftScore}
                onChange={() => toggleCheckbox(gift)}
              />
              <label htmlFor={gift}>{gift}</label>

              {gift in giftScore && (
                <select
                  value={giftScore[gift]} //giftScore.manner = 1
                  onChange={(e) => addScore(gift, e.target.value)} //manner와 점수를 넘김
                >
                  <option value="1">1점</option>
                  <option value="2">2점</option>
                  <option value="3">3점</option>
                  <option value="4">4점</option>
                </select>
              )}
            </div>
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
