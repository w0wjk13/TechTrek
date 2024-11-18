import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  //참여하기 버튼 클릭 시 작성자가 요구하는 역량에 부합하는지 확인
  approveReject: function (scoreData) {
    if (!this.userId) {
      throw new Meteor.Error("notLogin", "로그인이 필요합니다");
    }

    const { userScore, studyScore } = scoreData;
    //Object.keys() studyScore(작성자 요구역량)의 key를 배열로 만듦
    //every 배열의 모든 요소가 주어진 콜백함수를 통과하는지 테스트하고 true/false 반환
    const canJoin = Object.keys(studyScore).every(
      (key) => userScore[key] >= studyScore[key]
    );

    return canJoin;
  },
});
