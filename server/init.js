import { Study, StudyUsers } from "/imports/api/collections";
import "/lib/utils.js";



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
