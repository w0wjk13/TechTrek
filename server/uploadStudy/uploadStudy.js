import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  //스터디 모집글 작성
  insert: function (uploadData) {
    if (!this.userId) {
      throw new Meteor.Error("notLogin", "로그인이 필요합니다");
    }

    const validationMessage = {
      roles: "모집 분야를 선택해 주세요",
      onOffline: "모임 형태를 선택해 주세요",
      location: "지역을 선택해 주세요",
      studyCount: "모집 인원을 선택해 주세요",
      techStack: "기술스택을 최소 1개 선택해 주세요",
      studyClose: "모집마감일을 선택해 주세요",
      score: "원하는 역량을 최소 1개 선택하고 점수를 설정해 주세요",
      title: "제목을 입력해 주세요",
      content: "내용을 입력해 주세요",
    };

    for (const [field, message] of Object.entries(validationMessage)) {
      if (field === "techStack") {
        if (!uploadData[field] || uploadData[field].length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "score") {
        if (!uploadData[field] || Object.keys(uploadData[field]).length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "location") {
        if (uploadData.onOffline === "오프라인" && !uploadData.location) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (!uploadData[field]) {
        throw new Meteor.Error("validationError", message);
      }
    }

    // const writeCount = Study.findOne({ userId: this.userId });
    // if (writeCount) {
    //   throw new Meteor.Error(
    //     "noWrite",
    //     "스터디 모집글은 1개만 작성 가능합니다"
    //   );
    // }

    const data = {
      userId: this.userId,
      ...uploadData,
      createdAt: new Date(),
      views: 0,
    };

    return Study.insert(data); //insert된 문서 id 반환
  },

  //조회수 증가
  viewCount: (id) => {
    const result = Study.update({ _id: id }, { $inc: { views: 1 } });

    if (result === 0) {
      throw new Meteor.Error("notFound", "해당 게시물을 찾을 수 없습니다");
    }

    return true;
  },

  //스터디 모집글이 1개 있는지 확인한 후 모집글 작성 허용/거부
  // canWrite: function () {
  //   if (!this.userId) {
  //     throw new Meteor.Error("notLogin", "로그인이 필요합니다");
  //   }
  //   const writeCount = Study.findOne({ userId: this.userId });
  //   return writeCount ? true : false;
  // },
});
