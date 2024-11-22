import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  //시/도 목록
  const regionData = {
    서울: [
      "강남구",
      "강동구",
      "강서구",
      "강북구",
      "광진구",
      "구로구",
      "금천구",
      "노원구",
      "도봉구",
      "동대문구",
      "동작구",
      "마포구",
      "서대문구",
      "서초구",
      "성동구",
      "성북구",
      "송파구",
      "양천구",
      "영등포구",
      "용산구",
      "은평구",
      "종로구",
      "중구",
      "중랑구",
    ],
    부산: [
      "중구",
      "서구",
      "동구",
      "영도구",
      "부산진구",
      "동래구",
      "남구",
      "북구",
      "해운대구",
      "사하구",
      "금정구",
      "강서구",
      "연제구",
      "수영구",
      "사상구",
      "기장군",
    ],
    대구: [
      "중구",
      "동구",
      "서구",
      "남구",
      "북구",
      "수성구",
      "달서구",
      "달성군",
    ],
    인천: [
      "중구",
      "동구",
      "미추홀구",
      "연수구",
      "남동구",
      "부평구",
      "계양구",
      "서구",
      "강화군",
      "옹진군",
    ],
    광주: ["동구", "서구", "남구", "북구", "광산구"],
    대전: ["동구", "중구", "서구", "유성구", "대덕구"],
    울산: ["중구", "남구", "동구", "북구", "울주군"],
    세종: [],
    경기: [
      "수원시",
      "고양시",
      "용인시",
      "성남시",
      "부천시",
      "안산시",
      "안양시",
      "남양주시",
      "화성시",
      "평택시",
      "의정부시",
      "파주시",
      "시흥시",
      "김포시",
      "광명시",
      "광주시",
      "군포시",
      "하남시",
      "오산시",
      "이천시",
      "안성시",
      "의왕시",
      "양주시",
      "구리시",
      "포천시",
      "여주시",
      "양평군",
      "동두천시",
      "가평군",
      "연천군",
    ],
    강원: [
      "춘천시",
      "원주시",
      "강릉시",
      "동해시",
      "태백시",
      "속초시",
      "삼척시",
      "홍천군",
      "횡성군",
      "영월군",
      "평창군",
      "정선군",
      "철원군",
      "화천군",
      "양구군",
      "인제군",
      "고성군",
      "양양군",
    ],
    충북: [
      "청주시",
      "충주시",
      "제천시",
      "보은군",
      "옥천군",
      "영동군",
      "증평군",
      "진천군",
      "괴산군",
      "음성군",
      "단양군",
    ],
    충남: [
      "천안시",
      "공주시",
      "보령시",
      "아산시",
      "서산시",
      "논산시",
      "계룡시",
      "당진시",
      "금산군",
      "부여군",
      "서천군",
      "청양군",
      "홍성군",
      "예산군",
      "태안군",
    ],
    전북: [
      "전주시",
      "군산시",
      "익산시",
      "정읍시",
      "남원시",
      "김제시",
      "완주군",
      "진안군",
      "무주군",
      "장수군",
      "임실군",
      "순창군",
      "고창군",
      "부안군",
    ],
    전남: [
      "목포시",
      "여수시",
      "순천시",
      "나주시",
      "광양시",
      "담양군",
      "곡성군",
      "구례군",
      "고흥군",
      "보성군",
      "화순군",
      "장흥군",
      "강진군",
      "해남군",
      "영암군",
      "무안군",
      "함평군",
      "영광군",
      "장성군",
      "완도군",
      "진도군",
      "신안군",
    ],
    경북: [
      "포항시",
      "경주시",
      "김천시",
      "안동시",
      "구미시",
      "영주시",
      "영천시",
      "상주시",
      "문경시",
      "경산시",
      "의성군",
      "청송군",
      "영양군",
      "영덕군",
      "청도군",
      "고령군",
      "성주군",
      "칠곡군",
      "예천군",
      "봉화군",
      "울진군",
      "울릉군",
    ],
    경남: [
      "창원시",
      "진주시",
      "통영시",
      "사천시",
      "김해시",
      "밀양시",
      "거제시",
      "양산시",
      "의령군",
      "함안군",
      "창녕군",
      "고성군",
      "남해군",
      "하동군",
      "산청군",
      "함양군",
      "거창군",
      "합천군",
    ],
    제주: ["제주시", "서귀포시"],
  };

  //유저(주소) 스터디모집(지역) 만들기
  //시/도 랜덤 선택
  const regions = Object.keys(regionData); //시/도 목록을 배열로 반환
  //구/군 랜덤 선택
  //const gubunList = regionData[city];

  const [stackList, setStackList] = useState([]); //선택한 기술스택 목록
  const [date, setDate] = useState(null); //모집마감일
  const [studyType, setStudyType] = useState("온/오프라인"); //오프라인일 경우 주소입력창 보여주기
  const [giftScore, setGiftScore] = useState({}); //요구하는 역량과 점수
  const formRef = useRef(null); //백엔드프론트 온라인오프라인
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [city, setCity] = useState(""); //사용자가 선택한 지역
  const [gubun, setGubun] = useState("");

  const { user } = useTracker(() => {
    return { user: Meteor.user() };
  });
  console.log(Meteor.userId());

  const cityChange = (e) => {
    setCity(e.target.value);
    setGubun("");
  };

  const districts = city ? regionData[city] : [];

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
        address: {
          city: city,
          gubun: gubun,
        },
        studyCount: formData.get("studyCount"), //모집인원
        techStack: stackList, //기술스택
        studyClose: date,
        score: giftScore,
        title: titleRef.current.value,
        content: contentRef.current.value,
      };
      console.log("uploadData: ", uploadData);

      Meteor.call("insert", uploadData, (err, detailId) => {
        if (err) {
          if (err.error === "noWrite") {
            alert(err.reason);
          }
          console.error("insert 실패: ", err.reason);
          alert(err.reason);
        } else {
          console.log("uploadStudy insert call 성공");
          navigate(`/study/${detailId}`); //insert id
        }
      });
    } else {
      console.error("유저가 로그인하지 않았음");
    }
  };

  return (
    <>
      <h2>프로젝트 모집페이지</h2>
      <form onSubmit={handleSubmit} ref={formRef}>
        <h3>모집 분야</h3>
        <div>
          <div>
            <input
              type="radio"
              id="all"
              name="roles"
              value="풀스택"
              defaultChecked
            />
            <label htmlFor="fullstack">풀스택</label>
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
              value="온라인"
              onChange={(e) => setStudyType(e.target.value)}
            />
            <label htmlFor="online">온라인</label>
          </div>

          <div>
            <input
              type="radio"
              id="offline"
              name="studyType"
              value="오프라인"
              onChange={(e) => setStudyType(e.target.value)}
            />
            <label htmlFor="offline">오프라인</label>
          </div>

          <div>
            <input
              type="radio"
              id="onOffline"
              name="studyType"
              value="온/오프라인"
              onChange={(e) => setStudyType(e.target.value)}
              defaultChecked
            />
            <label htmlFor="onOffline">온/오프라인</label>
          </div>

          {(studyType === "오프라인" || studyType === "온/오프라인") && (
            <>
              <select name="address" value={city} onChange={cityChange}>
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

          {city && (
            <select
              name="district"
              value={gubun}
              onChange={(e) => setGubun(e.target.value)}
            >
              <option value="" disabled>
                구 선택
              </option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
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
