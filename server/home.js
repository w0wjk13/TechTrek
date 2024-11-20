import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections';  // Study 컬렉션을 import

Meteor.startup(() => {
  // 서버 시작 시 작업 (필요한 초기화 등)
});

// 서버 메서드 정의
Meteor.methods({
  searchStudies(filters) {
    const query = {};

    // 필터에 따른 쿼리 추가
    if (filters.city) {
      query.city = filters.city;
    }
    if (filters.gubun) {
      query.gubun = filters.gubun;
    }
    if (filters.techStack && filters.techStack.length > 0) {
      query.techStack = { $all: filters.techStack }; // 필터링한 기술 스택을 모두 포함하는 항목만
    }

    // 'roles' 필터 처리: "전체"로 선택되었을 때 모든 역할을 포함
    if (filters.roles) {
      if (filters.roles === "전체") {
        // "전체"가 선택되었을 경우, 모든 역할을 포함하는 데이터를 반환
        // roles 필터를 쿼리에서 제외
      } else if (filters.roles.length > 0) {
        // 선택된 역할로 필터링
        query.roles = { $in: filters.roles };
      }
    }

    // 'onOffline' 필터 처리
    if (filters.onOffline && filters.onOffline.length > 0) {
      query.onOffline = { $in: filters.onOffline };
    }

    // MongoDB에서 쿼리 결과 가져오기
    const results = Study.find(query).fetch();

    // 결과 반환
    return results;
  },

  getAllStudies() {
    // 모든 Study 데이터를 가져오기
    return Study.find().fetch();
  }
});
