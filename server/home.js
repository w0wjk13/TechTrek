import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections';  // Study 컬렉션을 import

Meteor.startup(() => {
  // 서버 시작 시 작업 (필요한 초기화 등)
});

// 서버 메서드 정의
Meteor.methods({
  searchStudies(filters) {
    const query = {};

    // 각 필터가 존재할 경우 쿼리에 조건을 추가
    if (filters.region) {
      query.region = filters.region;
    }
    if (filters.city) {
      query.city = filters.city;
    }
    if (filters.techStack && filters.techStack.length > 0) {
      query.techStack = { $all: filters.techStack }; // 필터링한 기술 스택을 모두 포함하는 항목만
    }
    if (filters.position) {
      query.position = filters.position;
    }
    if (filters.onlineOffline) {
      query.onlineOffline = filters.onlineOffline;
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
