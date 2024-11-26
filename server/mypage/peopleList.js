import { Meteor } from "meteor/meteor";
import { Study } from "/imports/api/collections";
import { StudyUser } from "/imports/api/collections";

Meteor.methods({
  approve: (studyId, userId) => {
    const study = Study.findOne({ _id: studyId });
    let okUser = StudyUser.find({ studyId: studyId, status: "승인됨" }).count();

    if (okUser >= study.studyCount - 1) {
      throw new Meteor.Error("teamFull", "이미 팀이 가득 찼습니다");
    }

    StudyUser.update(
      { studyId: studyId, userId: userId },
      { $set: { status: "승인됨" } }
    );

    Study.update({ _id: studyId }, { $addToSet: { teamMember: userId } });
  },

  reject: (studyId, userId) => {
    StudyUser.update(
      { studyId: studyId, userId: userId },
      { $set: { status: "거절됨" } }
    );
  },
});
