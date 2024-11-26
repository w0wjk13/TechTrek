import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import { StudyUser } from "/imports/api/collections";

Meteor.methods({
  //참여하기
  approveReject: (scoreData) => {
    const { userScore, studyScore, studyId } = scoreData;
    const study = Study.findOne({ _id: studyId });

    if (study.status !== "모집중") {
      throw new Meteor.Error("impossibleJoin", "모집 중인 스터디가 아닙니다");
    }

    let canJoin = true;
    for (key in studyScore) {
      //작성자가 요구하는 역량보다 유저 역량이 같거나 더 크다면 합격
      if (userScore[key] < studyScore[key]) {
        canJoin = false;
        break;
      }
    }

    if (canJoin) {
      StudyUser.insert({
        studyId: studyId,
        userId: Meteor.userId(),
        status: "대기중",
        date: new Date(),
      });
    }

    return canJoin;
  },

  //조회수 증가
  viewCount: (id) => {
    const result = Study.update({ _id: id }, { $inc: { views: 1 } });

    if (result === 0) {
      throw new Meteor.Error("notFound", "해당 게시물을 찾을 수 없습니다");
    }

    return true;
  },

  //참여 취소
  cancelRequest: (studyId) => {
    StudyUser.remove({ studyId: studyId, userId: this.userId });

    return true;
  },

  //이미 참여 요청한 사람은 참여하기 -> 참여 취소하기 버튼으로 바뀜
  alreadyRequest(studyId, userId) {
    //문서가 있다면(!=null) true, 문서가 없다면 false
    return StudyUser.findOne({ studyId: studyId, userId: userId }) != null;
  },

  //작성글 삭제
  delete: (studyId) => {
    const study = Study.findOne({ _id: studyId });

    StudyUser.remove({ studyId: studyId });
    Study.remove({ _id: studyId });
  },

  //작성글이 모집중인지 아닌지 확인
  checkStatus: (studyId) => {
    const study = Study.findOne({ _id: studyId });

    if (study.status !== "모집중") {
      throw new Meteor.Error(
        "NoDeleteStatus",
        "이미 시작하거나 마감된 스터디는 삭제할 수 없습니다"
      );
    }
    return true;
  },
});
