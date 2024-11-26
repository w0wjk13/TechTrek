import { Meteor } from "meteor/meteor";
import { Study } from "/imports/api/collections";

Meteor.methods({
  //status(모집중/시작/마감), 날짜(시작/마감) 업데이트
  updateStatus: (studyId, status) => {
    console.log("updateStatus 호출: ", { studyId, status });
    const study = Study.findOne({ _id: studyId });

    if (status === "모집중") {
      Study.update(
        { _id: studyId },
        {
          $unset: { startDate: null, endDate: null },
          $set: { status: "모집중" },
        }
      );
    } else if (status === "시작" && !study.startDate) {
      Study.update(
        { _id: studyId },
        { $set: { startDate: new Date(), status: "시작" } }
      );
    } else if (status === "종료" && !study.endDate) {
      Study.update(
        { _id: studyId },
        { $set: { endDate: new Date(), status: "종료" } }
      );
    }

    const rlt = Study.findOne({ _id: studyId });
    console.log("업데이트된 데이터: ", rlt);

    return {
      status: rlt.status,
      startDate: rlt.startDate,
      endDate: rlt.endDate,
    };
  },

  //status, 시작/마감날짜 가져오기
  getInfo: (studyId) => {
    const study = Study.findOne({ _id: studyId });

    return {
      status: study.status,
      startDate: study.startDate,
      endDate: study.endDate,
    };
  },
});
