import { Study, StudyUsers } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import "/lib/utils.js";

//admin 생성
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    password: "1234",
  });
}

//admin 외에 다른 사용자가 없다면
if (!Meteor.users.findOne({ username: { $ne: "admin" } })) {
  const randomPhone = () => {
    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    return `010-${randomDigits()}-${randomDigits()}`;
  };

  const phone = randomPhone();

  for (let i = 0; i < 10; i++) {
    Accounts.createUser({
      username: "user" + i,
      email: `user${i}@example.com`,
      password: "1234",
      profile: {
        profilePicture: `https://example.com/images/user${i}.jpg`,
        nickname: `nickname${i}`,
        phone: phone,
        address: [
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
        ].random(),
        techStack: [
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
        ].random(1, 5),
        position: ["백엔드", "프론트엔드", "풀스택"].random(),
        score: {
          manner: [1, 2, 3, 4, 5].random(), //매너(친절)
          mentoring: [1, 2, 3, 4, 5].random(), //다른 사람 도와주기(지식 공유)
          passion: [1, 2, 3, 4, 5].random(), //열정(참여도)
          communication: [1, 2, 3, 4, 5].random(), //의사소통
          time: [1, 2, 3, 4, 5].random(), //시간준수
        },
        createdAt: new Date(),
      },
    });
  }
}

// //스터디 모집글이 하나도 없다면
// if (!Study.findOne()) {
//   const gift = ["manner", "mentoring", "passion", "communication", "time"]; //설문지에서 평가하는 역량

//   for (let i = 0; i < 20; i++) {
//     //모집글 작성자가 요구하는 역량 1~5개 추출
//     const requiredGifts = gift.random(1, 5);

//     //추출한 역량에 해당하는 점수 1점 ~ 4점까지 랜덤으로 할당
//     const score = {};
//     requiredGifts.forEach((gift) => {
//       score[gift] = [1, 2, 3, 4].random(); //키(gift): 값(점수) 형태로 score에 들어감
//     });

//     const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
//     const loginUser = users.random();

//     Study.insert({
//       userId: loginUser._id,
//       nickname: `nickname${i}`,
//       onOffline: ["전체", "온라인", "온/오프라인"].random(),
//       location: "서울",
//       title: `스터디 모임 ${i}`,
//       content: `내용 ${i}`,
//       studyCount: [2, 3, 4, 5, 6, 7, 8, 9, 10].random(), //모집 인원
//       scores: score,
//       status: ["진행중", "마감"].random(),
//       views: Math.floor(Math.random() * 100) + 1,
//       createdAt: loginUser.createdAt,
//     });
//   }
// }

// //스터디 모임이 하나도 없다면
// if (!StudyUsers.findOne()) {
//   Study.find().forEach((study) => {
//     //스터디 모집 작성자 이외의 사용자 목록
//     const applyUsers = Meteor.users
//       .find({
//         $and: [{ _id: { $ne: study.userId } }, { username: { $ne: "admin" } }],
//       })
//       .fetch();
//     //스터디 모집 작성자를 포함한 스터디 모임 참가자 목록 생성
//     const teamMembers = [study.user_id];

//     //스터디 모집 인원 만큼 참가자 채우기
//     while (teamMembers.length < study.studyCount) {
//       const randomUser = applyUsers.random();

//       let ok = true;
//       for (let gift in study.giftScore) {
//         //유저의 점수가 모집글 요구 점수보다 작으면 추가하지 않음
//         if (randomUser.profile.avgScore[gift] < study.giftScore[gift]) {
//           ok = false;
//           break;
//         }
//       }

//       //유저의 점수가 모집글 요구 점수를 만족하고 중복된 아이디가 아니라면 모임에 추가
//       if (ok && !teamMembers.includes(randomUser._id)) {
//         teamMembers.push(randomUser._id);
//       }
//     }

//     Array.from(teamMembers).forEach((userId) => {
//       StudyUsers.insert({
//         studyId: study._id,
//         userId: userId,
//       });
//     });
//   });
// }

//----------------------------------------------------------------

// import { Study, StudyUsers } from "/imports/api/collections";
// import "/lib/utils.js";

// // 유저 더미 데이터 생성
// const randomEmail = (index) => `user${index}@example.com`;

// const randomPhone = () => {
//   const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
//   return `010-${randomDigits()}-${randomDigits()}`;
// };

// const randomTechStack = () => {
//   const techStacks = [
//     "Java",
//     "NodeJS",
//     "Kotlin",
//     "Mysql",
//     "MongoDB",
//     "Python",
//     "Oracle",
//     "AWS",
//     "Spring",
//     "Azure",
//     "NextJS",
//     "Kubernetes",
//     "Javascript",
//     "Flutter",
//     "Docker",
//     "Typescript",
//     "Swift",
//     "Django",
//     "React",
//     "ReactNative",
//   ];
//   const stack1 = techStacks[Math.floor(Math.random() * techStacks.length)];
//   let stack2;
//   do {
//     stack2 = techStacks[Math.floor(Math.random() * techStacks.length)];
//   } while (stack1 === stack2);
//   return [stack1, stack2];
// };

// const randomPosition = () => {
//   const positions = ["백엔드", "프론트엔드", "풀스택"];
//   return [positions[Math.floor(Math.random() * positions.length)]]; // 배열로 반환
// };

// const randomAddress = () => {
//   const districts = [
//     "강남구",
//     "강동구",
//     "강서구",
//     "강북구",
//     "광진구",
//     "구로구",
//     "금천구",
//     "노원구",
//     "도봉구",
//     "동대문구",
//     "동작구",
//     "마포구",
//     "서대문구",
//     "서초구",
//     "성동구",
//     "성북구",
//     "송파구",
//     "양천구",
//     "영등포구",
//     "용산구",
//     "은평구",
//     "종로구",
//     "중구",
//     "중랑구",
//   ];
//   const district = districts[Math.floor(Math.random() * districts.length)];
//   return { address: `서울 ${district}` };
// };

// if (!Accounts.findUserByUsername("admin")) {
//   Accounts.createUser({
//     name: "admin",
//     email: "admin@example.com",
//     password: "1234",
//     profile: {
//       name: "admin",
//     },
//   });
//   console.log("Admin account created: name: admin, password: 1234");
// } else {
//   console.log("Admin account already exists.");
// }

// for (let i = 1; i <= 100; i++) {
//   const name = `user${i}`;
//   const email = randomEmail(i);
//   const phone = randomPhone();

//   // 이메일 중복 체크
//   if (Meteor.users.findOne({ "profile.email": email })) {
//     console.log(`이메일 중복: ${email}`);
//     continue; // 중복된 이메일이 있으면 이 유저는 건너뜀
//   }

//   Accounts.createUser({
//     name: name,
//     email,
//     password: "1234",
//     profile: {
//       name: name,
//       nickname: `nickname${i}`,
//       phone,
//       profilePicture: "https://example.com/profile.jpg",
//       address: randomAddress(),
//       techStack: randomTechStack(),
//       position: randomPosition(),
//       avgScore: {
//         manner: 3, // 매너
//         mentoring: 3, // 재능기부
//         passion: 3, // 참여도
//         communication: 3, // 소통
//         time: 3, // 시간 준수
//       },
//       createdAt: new Date(),
//     },
//   });
// }
