import { Study, StudyUsers } from "/imports/api/collections";
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
  for (let i = 0; i < 50; i++) {
    Accounts.createUser({
      username: "user" + i,
      password: "1234",
      profile: {
        avg_score: {
          manner: [1, 2, 3, 4, 5].random(), //매너(친절)
          mentoring: [1, 2, 3, 4, 5].random(), //다른 사람 도와주기(지식 공유)
          passion: [1, 2, 3, 4, 5].random(), //열정(참여도)
          communication: [1, 2, 3, 4, 5].random(), //의사소통
          time: [1, 2, 3, 4, 5].random(), //시간준수
        },
      },
    });
  }
}

//스터디 모집글이 하나도 없다면
if (!Study.findOne()) {
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();
  const gift = ["manner", "mentoring", "passion", "communication", "time"]; //설문지에서 평가하는 역량

  for (let i = 0; i < 20; i++) {
    //모집글 작성자가 요구하는 역량 1~5개 추출
    const requiredGifts = gift.random(1, 5);

    //추출한 역량에 해당하는 점수 1점 ~ 4점까지 랜덤으로 할당
    const score = {};
    requiredGifts.forEach((g) => {
      score[g] = [1, 2, 3, 4].random();
    });
    //const scores = requiredGifts.map((gift) => [1, 2, 3, 4].random());

    Study.insert({
      user_id: users.random()._id,
      title: `스터디 모임 ${i}`,
      content: `내용 ${i}`,
      study_count: [2, 3, 4, 5, 6, 7, 8, 9, 10].random(), //모집 인원
      gift: requiredGifts,
      gift_score: score,
    });
  }
}

//스터디 모임이 하나도 없다면
if (!StudyUsers.findOne()) {
  const users = Meteor.users.find({ username: { $ne: "admin" } }).fetch();

  Study.find().forEach((study) => {
    //스터디 모집 작성자 이외의 사용자 목록
    const applyUsers = users.filter((user) => user._id !== study.user_id);
    //스터디 모집 작성자를 포함한 스터디 모임 참가자 목록 생성
    const teamMember = new Set([study.user_id]);

    //스터디 모집 인원 만큼 참가자 채우기
    while (teamMember.size < study.study_count) {
      const randomUser = applyUsers.random();
      teamMember.add(randomUser._id);
    }

    Array.from(teamMember).forEach((userId) => {
      StudyUsers.insert({
        study_id: study._id,
        user_id: userId,
        study_status: "시작",
      });
    });
  });
}
