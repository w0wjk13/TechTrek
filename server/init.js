import { Study, StudyUsers } from "/imports/api/collections";
import "/lib/utils.js";

// 유저 더미 데이터 생성
const randomEmail = (index) => `user${index}@example.com`;

const randomPhone = () => {
  const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
  return `010-${randomDigits()}-${randomDigits()}`;
};

const randomTechStack = () => {
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
  const stack1 = techStacks[Math.floor(Math.random() * techStacks.length)];
  let stack2;
  do {
    stack2 = techStacks[Math.floor(Math.random() * techStacks.length)];
  } while (stack1 === stack2);
  return [stack1, stack2];
};

const randomPosition = () => {
  const positions = ["백엔드", "프론트엔드", "풀스택"];
  return [positions[Math.floor(Math.random() * positions.length)]]; // 배열로 반환
};

const randomAddress = () => {
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
  const district = districts[Math.floor(Math.random() * districts.length)];
  return { address: `서울 ${district}` };
};
//
// console.log(!Meteor.users.findOne({ username: "admin" }));
if (!Meteor.users.findOne({ username: "admin" })) {
  Accounts.createUser({
    username: "admin",
    email: "admin@example.com",
    password: "1234",
    profile: {
      name: "admin",
    },
  });
  console.log("Admin account created: name: admin, password: 1234");
} else {
  console.log("Admin account already exists.");
}

try {
  for (let i = 1; i <= 100; i++) {
    const name = `user${i}`;
    const email = randomEmail(i);
    const phone = randomPhone();

    // 이메일 중복 체크
    if (Meteor.users.findOne({ "emails.address": email })) {
      console.log(`이메일 중복: ${email}`);
      continue; // 중복된 이메일이 있으면 이 유저는 건너뜀
    }

    // avgScore에 랜덤 값 1~5를 할당
    const avgScore = {
      manner: Math.floor(Math.random() * 5) + 1, // 매너 (1 ~ 5 랜덤 값)
      mentoring: Math.floor(Math.random() * 5) + 1, // 재능기부 (1 ~ 5 랜덤 값)
      passion: Math.floor(Math.random() * 5) + 1, // 참여도 (1 ~ 5 랜덤 값)
      communication: Math.floor(Math.random() * 5) + 1, // 소통 (1 ~ 5 랜덤 값)
      time: Math.floor(Math.random() * 5) + 1, // 시간 준수 (1 ~ 5 랜덤 값)
    };

    Accounts.createUser({
      name: name,
      email,
      password: "1234",
      profile: {
        name: name,
        nickname: `nickname${i}`,
        phone,
        profilePicture:
          "data:image/jpeg;base64,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",
        address: randomAddress(),
        techStack: randomTechStack(),
        position: randomPosition(),
        avgScore: avgScore, // 수정된 avgScore 할당
        createdAt: new Date(),
      },
    });
  }
} catch (err) {
  //무시할거임
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

//     Study.insert({
//       userId: users.random()._id,
//       title: `스터디 모임 ${i}`,
//       content: `내용 ${i}`,
//       studyCount: [2, 3, 4, 5, 6, 7, 8, 9, 10].random(), //모집 인원
//       scores: score,
//       status: "진행중",
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
