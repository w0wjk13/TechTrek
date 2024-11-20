import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import { StandBy } from "/imports/api/collections";

Meteor.methods({
  //참여하기 버튼 클릭 시 작성자가 요구하는 역량에 부합하는지 확인
  approveReject: function (scoreData) {
    //참여 버튼을 누른 유저의 로그인 정보 가져오기
    const user = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error("notLogin", "로그인이 필요합니다");
    }

    const { userScore, studyScore, studyId } = scoreData;
    let isOk = false;
    for (key in studyScore) {
      //작성자가 요구하는 역량보다 유저 역량이 같거나 더 크다면 합격
      if (studyScore[key] <= userScore[key]) {
        isOk = true;
        break;
      }
    }

    if (isOk) {
      StandBy.insert({
        studyId: studyId,
        userId: user._id,
        requestDate: new Date(),
        status: "대기중",
      });
    }

    return isOk;
  },

  //조회수 증가
  viewCount: (id) => {
    const result = Study.update({ _id: id }, { $inc: { views: 1 } });

    if (result === 0) {
      throw new Meteor.Error("notFound", "해당 게시물을 찾을 수 없습니다");
    }

    return true;
  },
});
