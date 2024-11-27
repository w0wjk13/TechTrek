import { Study, Application } from "/imports/api/collections";
import Data from "../imports/ui/Data.jsx";
const { citys, techStacks } = Data;
const noimage = '../imports/ui/image/noimage.png';

// citys 배열에서 랜덤으로 도시와 구를 선택하여 주소를 생성하는 함수
const randomAddress = () => {
  const city = citys[Math.floor(Math.random() * citys.length)];
  const gubun = city.gubuns[Math.floor(Math.random() * city.gubuns.length)];
  return {
    city: city.name,
    gubun: gubun,
  };
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
        profilePicture: noimage,
        address: randomAddress(),
        techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, 5),  // 랜덤으로 기술 스택 선택
        roles: ["백엔드", "프론트엔드", "풀스택"].sort(() => Math.random() - 0.5).slice(0, 1),  // 랜덤으로 역할 선택
        score: {
          manner: Math.floor(Math.random() * 5) + 1,
          mentoring: Math.floor(Math.random() * 5) + 1,
          passion: Math.floor(Math.random() * 5) + 1,
          communication: Math.floor(Math.random() * 5) + 1,
          time: Math.floor(Math.random() * 5) + 1,
        },
      },
      createdAt: new Date(),
    });
  }
}

// 스터디 모집글이 없다면 (30개 생성)
if (Study.find().count() === 0) {
  for (let i = 0; i < 30; i++) {  // 30개 스터디 모집글 생성
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
    const user = users[Math.floor(Math.random() * users.length)];  // 랜덤 사용자 선택

    // 현재 날짜에 1~30일 사이의 랜덤 값을 더해주어 한 달 내의 날짜를 설정
    const randomDays = Math.floor(Math.random() * 30) + 1;
    const studyClose = new Date();
    studyClose.setDate(studyClose.getDate() + randomDays);

    const scoreFields = ["manner", "mentoring", "passion", "communication", "time"];

    // 스터디 모집글 작성자가 요구하는 역량
    const needScore = scoreFields;

    // 요구하는 역량에 랜덤으로 점수 할당
    const score = {};
    needScore.forEach((need) => {
      score[need] = Math.floor(Math.random() * 5) + 1;  // 1~4 사이의 랜덤 점수
    });

    // 스터디 모집글 삽입
    const studyId = Study.insert({
      userId: user._id,
      roles: ["풀스택", "백엔드", "프론트엔드"].sort(() => Math.random() - 0.5).slice(0, 1),
      onOffline: ["온라인", "오프라인", "온/오프라인"].sort(() => Math.random() - 0.5).slice(0, 1),
      address: randomAddress(),
      studyCount: Math.floor(Math.random() * 10) + 1,  // 모집인원 (1~10명)
      techStack: techStacks.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 1),
      studyClose: studyClose,
      score: score,
      title: "제목" + (i + 1),
      content: "내용" + (i + 1),
      createdAt: new Date(),
      views: i,
      status: "모집중",
    });

    // 스터디 모집글 작성자가 자동으로 해당 스터디에 신청
    const existingApplication = Application.findOne({ studyId, userIds: { $in: [user._id] } });
    if (!existingApplication) {
      Application.insert({
        studyId: studyId,
        userIds: [user._id],  // 신청자 배열 초기화
        states: ['신청됨'],  // 신청 상태 배열 초기화
        createdAt: new Date(),
      });
    }
  }
}

// 스터디 모집글 중에서 랜덤으로 10개 선택해서 참가자 추가
const studyIds = Study.find().fetch().map(study => study._id);  // 모든 스터디 ID 가져오기
const randomStudyIds = [];

// 10개의 랜덤 스터디 모집글을 선택
while (randomStudyIds.length < 10) {
  const randomIndex = Math.floor(Math.random() * studyIds.length);
  const randomStudyId = studyIds[randomIndex];

  if (!randomStudyIds.includes(randomStudyId)) {
    randomStudyIds.push(randomStudyId);
  }
}

// 각 스터디 모집글에 대해 랜덤으로 참가자 추가
randomStudyIds.forEach((studyId) => {
  const study = Study.findOne(studyId);

  // 스터디 모집인원 수가 초과되지 않도록 하기 위한 인원 제한
  const maxApplicants = study.studyCount;
  const numOfApplicants = Math.min(Math.floor(Math.random() * 5) + 1, maxApplicants);  // 1~5명 랜덤 또는 모집인원 이하
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const applicants = [];

  // 랜덤 신청자 선택
  for (let i = 0; i < numOfApplicants; i++) {
    const applicant = users[Math.floor(Math.random() * users.length)];
    if (!applicants.includes(applicant._id)) {  // 중복을 피하기 위해
      applicants.push(applicant._id);

      // Application 컬렉션에 신청 정보 추가
      Application.update(
        { studyId: studyId },
        {
          $push: { userIds: applicant._id, states: '신청됨' },  // 신청자 추가
          $inc: { applicantCount: 1 }  // 신청자 수 증가
        }
      );
    }
  }

  // 해당 스터디의 총 신청자 수를 출력
  const totalApplicants = Application.find({ studyId: studyId }).fetch().reduce((sum, app) => sum + app.userIds.length, 0);
  console.log(`스터디 "${study.title}"에 총 ${totalApplicants}명이 신청했습니다.`);
});
