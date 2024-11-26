import { Study } from "/imports/api/collections";
import Data from "../imports/ui/Data.jsx";

const { citys, techStacks } = Data;

// citys 배열에서 랜덤으로 도시와 구를 선택하여 주소를 생성하는 함수
const randomAddress = () => {
  // 랜덤으로 도시 선택
  const city = citys[Math.floor(Math.random() * citys.length)];  // citys 배열에서 랜덤으로 도시를 선택
  // 해당 도시에서 랜덤으로 구 선택
  const gubun = city.gubuns[Math.floor(Math.random() * city.gubuns.length)];  // 선택된 도시에서 gubuns 배열을 이용해 랜덤으로 구를 선택

  // 주소 반환
  return `${city.name} ${gubun}`;  // 도시와 구를 결합하여 주소 반환
};

// 핸드폰 중간, 뒷번호 4자리 만들기
const randomNumber = () => {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join('');
};

// admin 생성
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

// admin 외에 다른 사용자가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= 20; i++) {
    Accounts.createUser({
      password: "1234",
      email: `user${i}@example.com`,
      profile: {
        name: "user" + i,
        nickname: `nickname${i}`,
        phone: `010-${randomNumber()}-${randomNumber()}`,
        profilePicture: "https://example.com/profile.jpg",
        address: randomAddress(),
        techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, 5),  // 랜덤으로 기술 스택 선택
        roles: ["백엔드", "프론트엔드", "풀스택"].sort(() => Math.random() - 0.5).slice(0, 1),  // 랜덤으로 역할 선택
        score: {
          manner: Math.floor(Math.random() * 5) + 1,  // 1~5 매너
          mentoring: Math.floor(Math.random() * 5) + 1,  // 1~5 멘토링
          passion: Math.floor(Math.random() * 5) + 1,  // 1~5 열정
          communication: Math.floor(Math.random() * 5) + 1,  // 1~5 의사소통
          time: Math.floor(Math.random() * 5) + 1,  // 1~5 시간 준수
        },
      },
      createdAt: new Date(),
    });
  }
}

// 스터디 모집글이 없다면
if (!Study.findOne()) {
  for (let i = 0; i < 30; i++) {
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
    const user = users[Math.floor(Math.random() * users.length)];  // 랜덤 사용자 선택

    // 현재 날짜에 1~30일 사이의 랜덤 값을 더해주어 한 달 내의 날짜를 설정
    const randomDays = Math.floor(Math.random() * 30) + 1;
    const studyClose = new Date();
    studyClose.setDate(studyClose.getDate() + randomDays);  // 현재 날짜에 랜덤 일수를 더함

    const scoreFields = ["manner", "mentoring", "passion", "communication", "time"];

    // 스터디 모집글 작성자가 요구하는 역량
    const needScore = scoreFields;

    // 요구하는 역량에 랜덤으로 점수 할당
    const score = {};
    needScore.forEach((need) => {
      score[need] = Math.floor(Math.random() * 5) + 1;  // 1~4 사이의 랜덤 점수
    });

    // 스터디 모집글 삽입
    Study.insert({
      userId: user._id,
      roles: ["풀스택", "백엔드", "프론트엔드"].sort(() => Math.random() - 0.5).slice(0, 1),  // 랜덤 역할 선택
      onOffline: ["온라인", "오프라인", "온/오프라인"].sort(() => Math.random() - 0.5).slice(0, 1),  // 랜덤 진행 방식
      address: randomAddress(),
      studyCount: Math.floor(Math.random() * 10) + 1,  // 총 모집인원 (1~10명)
      techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 1),  // 랜덤 기술 스택
      studyClose: studyClose,
      score: score,
      title: "제목" + (i+1),
      content: "내용" + (i+1),
      createdAt: new Date(),
      views: i,
      status: "모집중",
    });
  }
}
