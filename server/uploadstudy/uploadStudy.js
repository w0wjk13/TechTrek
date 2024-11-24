import { Study } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import { StudyUser } from "/imports/api/collections";

Meteor.methods({
  //스터디 모집글 작성
  insert: function (uploadData) {
    const validationMessage = {
      roles: "모집 분야를 선택해 주세요",
      onOffline: "모임 형태를 선택해 주세요",
      address: "지역을 선택해 주세요",
      studyCount: "모집 인원을 선택해 주세요",
      techStack: "기술스택을 최소 1개 선택해 주세요",
      studyClose: "모집마감일을 선택해 주세요",
      score: "원하는 역량을 최소 1개 선택하고 점수를 설정해 주세요",
      title: "제목을 입력해 주세요",
      content: "내용을 입력해 주세요",
    };

    //validationMessage의 각 속성에 대해 [키, 값] 형태의 배열이 요소인 배열 반환
    for (const [field, message] of Object.entries(validationMessage)) {
      if (field === "techStack") {
        if (!uploadData[field] || uploadData[field].length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "score") {
        if (!uploadData[field] || Object.keys(uploadData[field]).length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "address") {
        if (
          uploadData.onOffline === "오프라인" ||
          uploadData.onOffline === "온/오프라인"
        ) {
          if (!uploadData.address.city) {
            throw new Meteor.Error("validationError", message);
          }
          if (!uploadData.address.gubun) {
            throw new Meteor.Error("validationError", "구를 선택해 주세요");
          }
        }
      } else if (!uploadData[field]) {
        throw new Meteor.Error("validationError", message);
      }
    }

    const data = {
      userId: this.userId,
      ...uploadData,
      createdAt: new Date(),
      views: 0,
      status: "모집중",
      teamMember: [this.userId],
    };
    const studyId = Study.insert(data); //insert된 문서 id 반환

    return studyId;
  },

  //스터디 모집글 수정
  update: (id, uploadData) => {
    const study = Study.findOne({ _id: id });

    const validationMessage = {
      roles: "모집 분야를 선택해 주세요",
      onOffline: "모임 형태를 선택해 주세요",
      address: "지역을 선택해 주세요",
      studyCount: "모집 인원을 선택해 주세요",
      techStack: "기술스택을 최소 1개 선택해 주세요",
      studyClose: "모집마감일을 선택해 주세요",
      score: "원하는 역량을 최소 1개 선택하고 점수를 설정해 주세요",
      title: "제목을 입력해 주세요",
      content: "내용을 입력해 주세요",
    };

    //validationMessage의 각 속성에 대해 [키, 값] 형태의 배열이 요소인 배열 반환
    for (const [field, message] of Object.entries(validationMessage)) {
      if (field === "techStack") {
        if (!uploadData[field] || uploadData[field].length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "score") {
        if (!uploadData[field] || Object.keys(uploadData[field]).length === 0) {
          throw new Meteor.Error("validationError", message);
        }
      } else if (field === "address") {
        if (
          uploadData.onOffline === "오프라인" ||
          uploadData.onOffline === "온/오프라인"
        ) {
          if (!uploadData.address.city) {
            throw new Meteor.Error("validationError", message);
          }
          if (!uploadData.address.gubun) {
            throw new Meteor.Error("validationError", "구를 선택해 주세요");
          }
        }
      } else if (!uploadData[field]) {
        throw new Meteor.Error("validationError", message);
      }
    }

    const updateData = {
      ...uploadData,
      updatedAt: new Date(),
    };
    Study.update({ _id: id }, { $set: updateData });

    return id;
  },

  //모집글 수정할 때 사용자가 입력했던 값 표시하기
  getStudy: (id) => {
    try {
      const study = Study.findOne({ _id: id });

      return {
        roles: study.roles,
        onOffline: study.onOffline,
        city: study.address.city,
        gubun: study.address.gubun,
        studyCount: study.studyCount,
        techStack: study.techStack,
        studyClose: study.studyClose,
        score: study.score,
        title: study.title,
        content: study.content,
      };
    } catch (err) {
      console.error("getStudy 실패: ", err);
    }
  },
});
