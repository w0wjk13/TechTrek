import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

//Study.remove({});
Meteor.methods({
  insert: function (uploadData) {
    if (!this.userId) {
      throw new Meteor.Error("notLogin", "로그인 하세요");
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
      } else if (!uploadData[field]) {
        throw new Meteor.Error("validationError", message);
      }
    }

    const data = {
      userId: this.userId,
      ...uploadData,
      createdAt: new Date(),
    };

    Study.insert(data);

    return { success: true };
  },
});
