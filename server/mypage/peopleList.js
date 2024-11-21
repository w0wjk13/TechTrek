import { Meteor } from "meteor/meteor";
import { StandBy } from "/imports/api/collections";
import { StudyGroup } from "/imports/api/collections";

Meteor.methods({
  approve: (studyId, userId) => {
    StandBy.update(
      { studyId: studyId, userId: userId },
      { $set: { status: "승인됨" } }
    );

    const studyGroup = StudyGroup.findOne({ studyId: studyId });

    if (studyGroup) {
      StudyGroup.update(
        { _id: studyGroup._id },
        { $addToSet: { teamMember: userId } }
      );
    }
  },
});
