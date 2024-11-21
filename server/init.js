import { Study } from "/imports/api/collections";
import { Applicant } from "/imports/api/collections";

import "/lib/utils.js";

//시/도 목록
const regions = [
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

//서울일 경우 구 목록
const districts = [
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
];

//유저(주소) 스터디모집(지역) 만들기
const randomAddress = () => {
  const region = regions.random();

  if (region === "서울") {
    const district = districts.random();
    return { city: "서울", gubun: district };
  } else {
    return { city: region, gubun: null };
  }
};

//기술스택 목록
const techStacks = [
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

//핸드폰 중간, 뒷번호 4자리 만들기
const randomNumber = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 9].random(4).join("");
};

//admin 생성
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//admin 외에 다른 사용자가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  for (let i = 1; i <= 200; i++) {
    Accounts.createUser({
      password: "1234",
      email: `user${i}@example.com`,
      profile: {
        name: "user" + i,
        nickname: `nickname${i}`,
        phone: `010-${randomNumber()}-${randomNumber()}`,
        profilePicture: "https://example.com/profile.jpg",
        address: randomAddress(),
        techStack: techStacks.random(1, 5),
        roles: ["백엔드", "프론트엔드", "풀스택"].random(),
        score: {
          manner: [0, 1, 2, 3, 4, 5].random(), //매너(친절)
          mentoring: [0, 1, 2, 3, 4, 5].random(), //다른 사람 도와주기(지식 공유)
          passion: [0, 1, 2, 3, 4, 5].random(), //열정(참여도)
          communication: [0, 1, 2, 3, 4, 5].random(), //의사소통
          time: [0, 1, 2, 3, 4, 5].random(), //시간준수
        },
      },
      createdAt: new Date(),
    });
  }
}

//스터디 모집글이 없다면
if (!Study.findOne()) {
  for (let i = 0; i < 100; i++) {
    const user = Meteor.users.findOne();

    const randomWeeks = [7, 14, 21, 28].random(); //7, 14, 21, 28일 랜덤 선택
    const studyClose = new Date(); //모집마감일
    //Study문서 생성일을 기준으로 랜덤으로 1주~4주 후를 모집마감일로 설정
    studyClose.setDate(studyClose.getDate() + randomWeeks);

    const scoreFields = [
      "manner",
      "mentoring",
      "passion",
      "communcation",
      "time",
    ];

    //스터디모집글 작성자가 요구하는 역량
    const needScore = scoreFields.random(1, 5);

    //요구하는 역량에 랜덤으로 점수 할당
    const score = {};
    needScore.forEach((need) => {
      score[need] = [1, 2, 3, 4].random();
    });

    const teamMember = [user._id];

    //팀원이 2명 이상이 되면 시작, 마감도 설정. 팀원이 1명(작성 시점)이면 모집중
    let status = "모집중";
    if (teamMember.length >= 2) {
      status = ["모집중", "시작", "마감"].random();
    }

    Study.insert({
      userId: user._id,
      roles: user._id.roles,
      onOffline: ["온라인", "오프라인", "온/오프라인"].random(),
      address: randomAddress(),
      studyCount: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].random(), //총 모집인원
      techStack: techStacks.random(1, 5),
      studyClose: studyClose,
      score: score,
      title: "제목" + i,
      content: "내용" + i,
      createdAt: new Date(),
      views: i,
      status: status,
      teamMember: teamMember,
    });
  }
}

// //스터디 신청자가 없다면
if (!Applicant.findOne()) {
  for (let i = 0; i < 50; i++) {
    const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();

    //스터디가 요구하는 역량에 부합하는 사용자만 신청 가능하도록 설정
    Study.find()
      .fetch()
      .forEach((study) => {
        const studyScore = study.score;

        users.forEach((user) => {
          const userScore = user.profile.score;

          let canJoin = false;

          //스터디에서 요구하는 역량/점수와 유저의 역량/점수 비교
          for (let key in studyScore) {
            if (userScore[key] >= studyScore[key]) {
              canJoin = true;
              break;
            }
          }

          //스터디에 신청이 가능하다면
          if (canJoin) {
            //승인된 유저의 수는 studyCount-1을 넘을 수 없음
            const okUser = Applicant.find({
              studyId: study._id,
              status: "승인됨",
            }).count();

            if (okUser < study.studycount - 1) {
              const status = ["대기중", "승인됨", "거절됨"].random();

              try {
                Applicant.insert({
                  studyId: study._id,
                  userId: user._id,
                  status: status,
                });
              } catch (error) {
                console.error("Applicant error: ", error);
              }

              //승인된 유저는 Study의 팀원 목록에 올라감
              if (status === "승인됨") {
                Study.update(
                  { _id: study._id },
                  { $addToSet: { teamMember: user._id } }
                );
              }
            }
          }
        });
      });
  }
}
